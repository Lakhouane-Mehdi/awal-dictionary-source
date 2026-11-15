// Imports the Zaouiat Ahansal Tamazight-English dictionary PDF into
// src/data/dictionary.json. Run with: node scripts/import_pdf.mjs
//
// Works from the position of every text fragment instead of plain text:
// - Fragments that touch belong to the same word, so no stray spaces
//   ("Hash a , orn n igh" was the old output for "Hasha, ornnigh atiskrgh").
// - Columns are cut at fixed x positions, and each half of a two-column
//   page is grouped into rows on its own, because the halves have
//   independent baselines.
// - Wrapped lines are joined back onto their entry, across pages too.
// - Every section is read with its own layout, including the verb tables
//   (infinitive / present continuous / 1st person past), countries, and
//   the usage notes of the God phrases.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PDF_PATH = path.join(ROOT, 'dictionary.pdf');
const OUT_PATH = path.join(ROOT, 'src/data/dictionary.json');

// Page ranges come from the PDF's table of contents. `groups` lists the
// column start x of each side-by-side table on a page; `fields` names
// those columns, key column first.
const SECTIONS = [
    { name: 'eng-tam', from: 5, to: 48, groups: [[72, 189], [324, 441]], fields: ['english', 'tamazight'] },
    { name: 'tam-eng', from: 49, to: 95, groups: [[72, 191], [324, 443]], fields: ['tamazight', 'english'] },
    { name: 'Verbs', from: 96, to: 139, groups: [[77, 233, 354, 465]], fields: ['english', 'tamazight', 'present', 'past'] },
    { name: 'Countries', from: 140, to: 142, groups: [[72, 197], [324, 449]], fields: ['english', 'tamazight'] },
    { name: 'God Phrases', from: 143, to: 144, groups: [[53, 188, 321]], fields: ['tamazight', 'english', 'usage'] },
];

const HEADER_TEXT = new Set([
    'English-Tamazight', 'Tamazight-English', 'Verbs', 'Countries', 'God Phrases',
    'English', 'Infinitive', 'Present continuous', '1st person past',
    'Present continuous 1st person past', 'Phrase', 'English translation', 'When used',
]);

const FOOTER_Y = 50;        // page numbers sit at y ≈ 36-40
const ROW_TOLERANCE = 3;    // fragments within 3pt of each other share a row
const PAIR_DISTANCE = 10;   // split rows (a cell sits a few pt off) within 10pt are merged
const WORD_GAP = 1.5;       // a gap wider than this between fragments is a space
const SLACK = 6;            // a fragment starting up to 6pt before a column still belongs to it

const clean = text =>
    text
        .normalize('NFC')
        .replace(/\u00AD|\u2010/g, '-')
        .replace(/ﻉع|ﻉ|ع/g, 'ɛ') // ع is drawn from a glyph font that extracts as two characters
        .replace(/\s+/g, ' ')
        .replace(/\s+([,;.)])/g, '$1')
        .replace(/\(\s+/g, '(')
        .trim();

// In the Tamazight-English pages, a word starting with ع comes out with the
// letter and the full stop moved to the end by bidi reordering:
// "adiﻉع." is ɛadi (Arabic عادي, "normal").
const fixLeadingAyn = text => text.replace(/^(.+?)ɛ\.$/, 'ɛ$1');

const columnOf = (anchors, x) => {
    let col = -1;
    anchors.forEach((a, i) => { if (x + SLACK >= a) col = i; });
    return col;
};

const joinFragments = items => {
    let text = '';
    let end = -Infinity;
    for (const it of items.sort((a, b) => a.transform[4] - b.transform[4])) {
        const x = it.transform[4];
        if (text && x - end > WORD_GAP && !text.endsWith(' ') && !it.str.startsWith(' ')) text += ' ';
        text += it.str;
        end = x + it.width;
    }
    return text;
};

const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
const doc = await pdfjs.getDocument({ data: new Uint8Array(fs.readFileSync(PDF_PATH)), verbosity: 0 }).promise;

const entries = [];
const warnings = [];

for (const section of SECTIONS) {
    let last = null; // previous entry in reading order, for wrapped lines

    for (let pageNo = section.from; pageNo <= section.to; pageNo++) {
        const page = await doc.getPage(pageNo);
        const items = (await page.getTextContent()).items.filter(it => it.str && it.transform[5] > FOOTER_Y);

        // Assign every fragment to a table (group) and a column
        const groups = section.groups.map(() => []);
        for (const it of items) {
            const x = it.transform[4];
            const g = columnOf(section.groups.map(cols => cols[0]), x);
            if (g < 0) continue;
            const col = columnOf(section.groups[g], x);
            if (col < 0) continue;
            const nextStart = section.groups[g][col + 1] ?? section.groups[g + 1]?.[0];
            if (nextStart && x + it.width > nextStart + 2 && it.str.trim()) {
                warnings.push(`p${pageNo}: "${it.str}" runs past its column`);
            }
            groups[g].push({ it, col });
        }

        for (const group of groups) {
            // Rows: cluster by baseline
            const rows = [];
            for (const f of group.sort((a, b) => b.it.transform[5] - a.it.transform[5])) {
                const y = f.it.transform[5];
                const row = rows.at(-1);
                if (row && row.y - y <= ROW_TOLERANCE) row.frags.push(f);
                else rows.push({ y, frags: [f] });
            }

            // Cells per row
            const cellRows = rows.map(r => {
                const cells = {};
                section.fields.forEach((_, c) => {
                    const frags = r.frags.filter(f => f.col === c).map(f => f.it);
                    const text = clean(joinFragments(frags));
                    if (text) cells[c] = text;
                });
                return { y: r.y, cells };
            }).filter(r => Object.keys(r.cells).length > 0)
              .filter(r => !Object.values(r.cells).every(t => HEADER_TEXT.has(t)));

            // A row split over two baselines (cells a few pt apart, filling
            // different columns) is one row
            const merged = [];
            for (const r of cellRows) {
                const prev = merged.at(-1);
                const disjoint = prev && Object.keys(r.cells).every(c => !(c in prev.cells));
                const prevIncomplete = prev && Object.keys(prev.cells).length < section.fields.length;
                if (prev && disjoint && prevIncomplete && prev.y - r.y <= PAIR_DISTANCE) {
                    Object.assign(prev.cells, r.cells);
                } else {
                    merged.push({ ...r, cells: { ...r.cells } });
                }
            }

            for (const r of merged) {
                const cols = Object.keys(r.cells).map(Number);
                const valueCols = cols.filter(c => c !== 0);
                const missingInLast = last ? section.fields.map((f, c) => c).filter(c => !last[section.fields[c]]) : [];
                // A row continues the previous entry when it is a wrapped line:
                // - it has no key cell (the meaning or form wrapped), or
                // - it is only a key cell (the English wrapped), or
                // - it fills cells the previous entry is still missing, e.g.
                //   "to divide a slaughtered | - | tuzzaɛ | uzzɛgh" followed by
                //   "animal | uzzɛ" on the next line.
                const continues = last && (
                    !(0 in r.cells) ||
                    valueCols.length === 0 ||
                    valueCols.every(c => missingInLast.includes(c))
                );
                if (continues) {
                    for (const [c, text] of Object.entries(r.cells)) {
                        const field = section.fields[c];
                        last[field] = last[field] ? `${last[field]} ${text}` : text;
                    }
                    continue;
                }
                if (!(0 in r.cells) || valueCols.length === 0) {
                    warnings.push(`p${pageNo}: orphan row ${JSON.stringify(r.cells)}`);
                    continue;
                }
                const entry = { section: section.name, page: pageNo };
                section.fields.forEach((field, c) => { if (r.cells[c]) entry[field] = r.cells[c]; });
                entries.push(entry);
                last = entry;
            }
        }
    }
}

for (const e of entries) {
    if (e.section === 'tam-eng') e.tamazight = fixLeadingAyn(e.tamazight);
    for (const k of ['english', 'tamazight', 'present', 'past', 'usage']) {
        if (e[k]) e[k] = clean(e[k]);
    }
}

// The same bidi glitch appears elsewhere without the full stop: "adiɛ" for
// ɛadi, verb "aqbɛ / tɛqab / aqbghɛ" for ɛaqb. Many Arabic loanwords really
// end in ɛ (ljamɛ "mosque", shariɛ "street"), so only move the ɛ when the
// corrected spelling appears elsewhere in the dictionary. A verb's other
// forms follow its infinitive.
const TAMAZIGHT_FIELDS = ['tamazight', 'present', 'past'];
const splitWords = text => text.split(/[\s;,/]+/).map(w => w.replace(/[.*!]/g, '')).filter(Boolean);
const knownWords = new Set(entries.flatMap(e => TAMAZIGHT_FIELDS.flatMap(f => (e[f] ? splitWords(e[f]) : []))));
const moveAynToFront = text => `ɛ${text.replace(/ɛ\.?$/, '')}`;
let aynFixes = 0;
for (const e of entries) {
    if (!e.tamazight || !/ɛ\.?$/.test(e.tamazight)) continue;
    const candidate = moveAynToFront(e.tamazight);
    if (!knownWords.has(splitWords(candidate)[0])) continue;
    e.tamazight = candidate;
    aynFixes++;
    for (const f of ['present', 'past']) {
        if (e[f] && /ɛ\.?$/.test(e[f])) e[f] = moveAynToFront(e[f]);
    }
}
console.log(`Moved a misplaced leading ɛ back in ${aynFixes} entries`);

// Typos in the printed book itself, keyed by section + Tamazight + English
// Runs after the ɛ fixes above, so `tamazight` matches the text that the
// live IDs were derived from. A correction with keepId records the text the entry's ID was derived from
// (idKey), so fixing the text does not break links to it. Corrections made
// before IDs went live leave it out: their IDs already use the fixed text.
// Leave `section` out to fix every section the row appears in.
const SOURCE_CORRECTIONS = [
    // The numbers list reads "1 Yan, 5 Sin, 3 Krad"; Sin is two
    { section: 'eng-tam', tamazight: 'Sin(masc.)/snat(fem.)', english: '5', set: { english: '2' } },
    // Bidi printed "ɛjb* i (reflexive)" as ")jb* i (reflexiveع"
    {
        tamazight: 'ɛ)jb* i (reflexive', english: 'to please someone', keepId: true,
        set: { tamazight: 'ɛjb* i (reflexive)' }, setIf: { past: ['jbghɛ* i', 'ɛjbgh* i'] },
    },
];
for (const fix of SOURCE_CORRECTIONS) {
    const hits = entries.filter(e => (!fix.section || e.section === fix.section) && e.tamazight === fix.tamazight && e.english === fix.english);
    if (!hits.length) throw new Error(`Source correction no longer matches: ${JSON.stringify(fix)}`);
    for (const hit of hits) {
        if (fix.keepId) hit.idKey ??= `${hit.section}|${hit.tamazight}|${hit.english}`;
        Object.assign(hit, fix.set);
        for (const [field, [from, to]] of Object.entries(fix.setIf ?? {})) {
            if (hit[field] === from) hit[field] = to;
        }
    }
}


// Field order: english, tamazight, the rest. Entry IDs are not stored:
// src/data/dictionary.ts derives them from section + tamazight + english,
// which keeps them stable across re-imports without shipping 8,600 hashes.
// Every row is from the Zaouiat Ahansal (Central Atlas Tamazight)
// dictionary, so the dialect is not repeated on each one either.
const ordered = entries.map(({ english, tamazight, section, page, ...rest }) =>
    ({ english, tamazight, ...rest, section, page }));

fs.writeFileSync(OUT_PATH, JSON.stringify(ordered, null, 2) + '\n');

const counts = {};
for (const e of ordered) counts[e.section] = (counts[e.section] ?? 0) + 1;
console.log(`Wrote ${ordered.length} entries to ${path.relative(ROOT, OUT_PATH)}`, counts);
if (warnings.length) {
    console.log(`${warnings.length} warnings:`);
    for (const w of warnings.slice(0, 40)) console.log('  ' + w);
}

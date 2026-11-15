import { describe, it, expect } from 'vitest';
import { dictionaryData, idAliases } from '../data/dictionary';
import rawRows from '../data/dictionary.json';
import legacyIds from '../data/legacy_pdf_ids.json';
import { migrateLegacyIds, resolveLegacyId } from '../utils/legacyIds';
import { pdfLatinToIrcam } from '../utils/scriptConverter';
import { splitGrammarNotes } from '../utils/grammarNotes';

const pdf = dictionaryData.filter(e => e.source === 'PDF Import');
// Entries list every meaning once ("to rob; to steal"), so match any one of them
const find = (definition: string) => pdf.filter(e => e.definition === definition || e.definition.split('; ').includes(definition));

describe('PDF import (scripts/import_pdf.mjs)', () => {
    it('keeps words whole instead of splitting them at fragment boundaries', () => {
        expect(find('"I will never do that"').map(e => e.term_latin)).toContain('ḥasha, ornnigh atiskrgh');
        expect(find('all').map(e => e.term_latin)).toContain('kullu, kolshi');
    });

    it('joins wrapped lines back onto their entry', () => {
        expect(find('Allah (figurative speech)').map(e => e.term_latin)).toContain('mulana');
        expect(find('another').map(e => e.term_latin)).toContain('wayyad/tayyad; yadnin; yadnn');
    });

    it('turns the extracted ع glyphs into ɛ and puts a leading ɛ back in front', () => {
        expect(pdf.some(e => /[\u0600-\u06FF\uFE70-\uFEFF]/.test(e.term_latin))).toBe(false);
        expect(find('normal').map(e => e.term_latin)).toContain('ɛadi');
        // Genuine word-final ɛ stays put
        expect(find('mosque').map(e => e.term_latin)).toContain('ljamɛ');
    });

    it('reads the verb tables with all three forms', () => {
        const absorb = find('to absorb').find(e => e.term_latin === 'sw');
        expect(absorb?.conjugation).toEqual({ aorist: 'sw', intensive: 'ssa', preterite: 'swigh' });
    });

    it('keeps every distinct verb table from the PDF, even when meanings merge', () => {
        const form = (text: string) => pdfLatinToIrcam(splitGrammarNotes(text).term);
        const expected = new Set(rawRows.filter(r => r.section === 'Verbs').map(r =>
            JSON.stringify([form(r.tamazight), 'present' in r && r.present ? form(r.present) : undefined, 'past' in r && r.past ? form(r.past) : undefined])));
        const kept = new Set(dictionaryData.filter(e => e.conjugation).map(e =>
            JSON.stringify([e.conjugation!.aorist, e.conjugation!.intensive, e.conjugation!.preterite])));
        expect([...expected].filter(t => !kept.has(t))).toEqual([]);
        expect(expected.size).toBeGreaterThan(1000);
    });

    it('lists each meaning once when one word is repeated across the PDF', () => {
        expect(pdf.filter(e => e.term_latin === 'lkatib').map(e => e.definition)).toEqual(['author; secretary']);
        // ...but never across different verb tables: akr is "to rob" (takur)
        // and "to steal" (takr)
        expect(pdf.filter(e => e.term_latin === 'akr').map(e => e.conjugation?.intensive).sort()).toEqual(['takr', 'takur']);
        // Homographs with unrelated meanings stay apart
        expect(dictionaryData.filter(e => e.term_latin === 'adu').map(e => e.definition).sort()).toEqual(['attack', 'smell']);
    });

    it('never stores a verb with its columns swapped', () => {
        expect(pdf.filter(e => /^to\s/.test(e.term_latin)).map(e => e.term_latin)).toEqual([]);
    });

    it('keeps the usage note of every God phrase', () => {
        const phrases = rawRows.filter(r => r.section === 'God Phrases');
        expect(phrases.length).toBeGreaterThan(30);
        expect(phrases.every(r => 'usage' in r && r.usage)).toBe(true);
        expect(find('in the name of God')[0]?.usage).toMatch(/before eating/);
    });

    it('files table entries under their table even when the dictionary half lists them too', () => {
        expect(find('in the name of God')[0]?.category).toBe('God Phrases');
        expect(find('Morocco').map(e => e.category)).toContain('Countries');
    });

    it('does not label Zaouiat Ahansal (Central Atlas) words as another dialect', () => {
        expect(pdf.filter(e => e.dialects && Object.values(e.dialects).some(Boolean))).toEqual([]);
    });

    it('applies corrections for typos in the printed book', () => {
        expect(find('2').map(e => e.term_latin)).toContain('Sin/snat');
    });

    it('gives every entry a unique ID', () => {
        expect(new Set(dictionaryData.map(e => e.id)).size).toBe(dictionaryData.length);
    });
});

describe('legacy PDF IDs', () => {
    const ids = new Set(dictionaryData.map(e => e.id));

    it('maps old IDs only to entries that exist', () => {
        expect(legacyIds.length).toBe(8365);
        // An ID may point at an entry that was later merged; the word page
        // and favourites follow idAliases to the entry that was kept
        expect(legacyIds.filter(id => id && !ids.has(idAliases.get(id) ?? id))).toEqual([]);
        expect(legacyIds.filter(Boolean).length).toBeGreaterThan(8300);
    });

    it('resolves an old link to the same word', async () => {
        const newId = await resolveLegacyId('imp_0');
        expect(dictionaryData.find(e => e.id === newId)?.term_latin).toBe('shɛra');
        expect(await resolveLegacyId('pdf_abc')).toBeUndefined();
    });

    it('migrates saved favourites and drops duplicates', async () => {
        const first = legacyIds.findIndex(Boolean);
        const migrated = await migrateLegacyIds([`imp_${first}`, legacyIds[first]!, 'g1']);
        expect(migrated).toEqual([legacyIds[first], 'g1']);
        const untouched = ['g1', 'ircam_v_0'];
        expect(await migrateLegacyIds(untouched)).toBe(untouched);
    });
});

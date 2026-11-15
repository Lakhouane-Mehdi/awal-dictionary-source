import { describe, it, expect } from 'vitest';
import { dictionaryData } from '../data/dictionary';
import rawRows from '../data/dictionary.json';
import legacyIds from '../data/legacy_pdf_ids.json';
import { migrateLegacyIds, resolveLegacyId } from '../utils/legacyIds';

const pdf = dictionaryData.filter(e => e.source === 'PDF Import');
const find = (definition: string) => pdf.filter(e => e.definition === definition);

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
        const absorb = find('to absorb').find(e => e.conjugation);
        expect(absorb?.conjugation).toEqual({ aorist: 'sw', intensive: 'ssa', preterite: 'swigh' });
        const verbs = dictionaryData.filter(e => e.conjugation && Object.values(e.conjugation).some(Boolean));
        expect(verbs.length).toBeGreaterThan(1200);
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
        expect(find('2').map(e => e.term_latin)).toContain('Sin(masc.)/snat(fem.)');
    });

    it('gives every entry a unique ID', () => {
        expect(new Set(dictionaryData.map(e => e.id)).size).toBe(dictionaryData.length);
    });
});

describe('legacy PDF IDs', () => {
    const ids = new Set(dictionaryData.map(e => e.id));

    it('maps old IDs only to entries that exist', () => {
        expect(legacyIds.length).toBe(8365);
        expect(legacyIds.filter(id => id && !ids.has(id))).toEqual([]);
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

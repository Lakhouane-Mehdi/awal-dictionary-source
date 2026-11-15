import { describe, it, expect } from 'vitest';
import { searchEntries } from '../hooks/useSearch';
import { dictionaryData } from '../data/dictionary';
import tatoebaExamples from '../data/tatoeba_examples.json';

const top = (q: string, n = 5) => searchEntries(q).slice(0, n).map(e => e.term_latin.toLowerCase());

describe('dictionary data', () => {
    it('gives every entry a real Latin spelling', () => {
        const tifinaghInLatin = dictionaryData.filter(e => /[ⴰ-⵿]/.test(e.term_latin));
        expect(tifinaghInLatin.map(e => e.term_latin)).toEqual([]);
    });

    it('has no garbled characters (UTF-8 read as Windows-1252) in example sentences', () => {
        const text = JSON.stringify(tatoebaExamples);
        expect(text.match(/[ÃÉáâ][\u0080-¿£¸]|[\u0080-\u009F]/g)).toBeNull();
    });

    it('never leaves Latin letters in generated Tifinagh', () => {
        // English glosses in parentheses, e.g. "(masc.)", are not Tamazight
        const leaked = dictionaryData
            .filter(e => e.source && /[a-zA-Zşţď]/.test(e.term_tifinagh.replace(/\([^)]*\)/g, '')))
            .map(e => `${e.term_latin} -> ${e.term_tifinagh}`);
        expect(leaked.slice(0, 10)).toEqual([]);
    });
});

describe('searchEntries', () => {
    it('finds the same word from any script', () => {
        expect(top('azul')).toContain('azul');
        expect(top('ⴰⵣⵓⵍ')).toContain('azul');
        expect(top('أزول')).toContain('azul');
    });

    it('matches across transcriptions', () => {
        // The curated entry is spelled "Tamghart"; IRCAM spelling uses ɣ
        expect(top('tamɣart')).toContain('tamghart');
        expect(top('ⵜⴰⵎⵖⴰⵔⵜ')).toContain('tamghart');
    });

    it('finds IRCAM verbs by their Latin spelling', () => {
        const verb = searchEntries('ⴰⴱⵔ').find(e => e.source === 'IRCAM');
        expect(verb).toBeDefined();
        expect(searchEntries(verb!.term_latin)).toContain(verb);
    });

    it('still searches English meanings', () => {
        expect(searchEntries('water').length).toBeGreaterThan(0);
        expect(searchEntries('hello').map(e => e.term_latin)).toContain('Azul');
    });

    it('returns nothing for an empty query', () => {
        expect(searchEntries('   ')).toEqual([]);
    });
});

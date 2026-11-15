import { describe, it, expect } from 'vitest';
import { categorizeWord, lexiconEntries } from '../data/categorize';
import { dictionaryData } from '../data/dictionary';
import { categories } from '../data/taxonomy';

describe('categorizeWord', () => {
    it('lists every word under one category only', () => {
        const seen = new Map<string, string>();
        const clashes: string[] = [];
        for (const [word, category] of lexiconEntries()) {
            const first = seen.get(word);
            if (first && first !== category) clashes.push(`${word}: ${first} / ${category}`);
            seen.set(word, category);
        }
        expect(clashes).toEqual([]);
    });

    it('finds plurals of listed words', () => {
        expect(categorizeWord('trees')).toBe('Nature');
        expect(categorizeWord('flies')).toBe('Animals');
        expect(categorizeWord('leaves')).toBe('Nature');
        expect(categorizeWord('teeth')).toBe('Body');
        expect(categorizeWord('eggs')).toBe('Food');
    });

    it('goes by the head noun of a phrase', () => {
        expect(categorizeWord('red fox')).toBe('Animals');
        expect(categorizeWord('cooking pot')).toBe('Household');
        expect(categorizeWord('bottom (of)')).toBe('Body');
        expect(categorizeWord('pot for couscous')).toBe('Household');
    });

    it('reads a qualifier after a comma as part of the phrase', () => {
        expect(categorizeWord('pen, animal')).toBe('Farming');
        expect(categorizeWord('pen')).toBe('Education');
    });

    it('falls back on the note in brackets', () => {
        expect(categorizeWord('pupil (of eye)')).toBe('Body');
        expect(categorizeWord('dates (fruit)')).toBe('Food');
        expect(categorizeWord('cook (person)')).toBe('People');
    });

    it('keeps verbs, numerals and little words apart', () => {
        expect(categorizeWord('to eat')).toBe('Verbs');
        expect(categorizeWord('to')).toBe('Grammar Words');
        expect(categorizeWord('24')).toBe('Numbers');
        expect(categorizeWord('in front of')).toBe('Grammar Words');
        expect(categorizeWord('do/is (question word before verb)')).not.toBe('Pronouns');
        expect(categorizeWord('my house')).toBe('Places');
    });

    it('leaves words it cannot place in General', () => {
        expect(categorizeWord('problem')).toBe('General');
    });
});

describe('dictionary categories', () => {
    // These category pages are in the sitemap; none may end up empty
    const PUBLISHED = [
        'Verbs', 'Countries', 'God Phrases', 'Family', 'Body', 'Food', 'Nature', 'Numbers', 'Animals',
        'Time', 'Adjectives', 'Colors', 'Culture', 'Weather', 'Places', 'Clothing', 'Greetings',
        'Pronouns', 'General',
    ];

    it('keeps every published category', () => {
        const names = new Set(categories.map(c => c.name));
        expect(PUBLISHED.filter(name => !names.has(name))).toEqual([]);
    });

    it('sorts nearly every entry into a real category', () => {
        const general = dictionaryData.filter(e => e.category === 'General').length;
        expect(general / dictionaryData.length).toBeLessThan(0.03);
    });
});

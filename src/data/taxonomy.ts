// Derived views over the dictionary: categories, roots, and letter groups.
// Every browse/category/root page reads from here so the site never
// disagrees with itself about what exists.

import { dictionaryData, type DictionaryEntry } from './dictionary';

export const slugify = (value: string): string =>
    value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export interface CategorySummary {
    name: string;
    slug: string;
    count: number;
}

// Categories that describe real semantic groups. 'General' is the
// catch-all bucket and is listed last rather than promoted.
export const categories: CategorySummary[] = (() => {
    const counts = new Map<string, number>();
    for (const entry of dictionaryData) {
        const name = entry.category?.trim();
        if (!name) continue;
        counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    return [...counts.entries()]
        .map(([name, count]) => ({ name, slug: slugify(name), count }))
        .sort((a, b) => {
            if (a.name === 'General') return 1;
            if (b.name === 'General') return -1;
            return b.count - a.count;
        });
})();

export const getCategoryBySlug = (slug: string): CategorySummary | undefined =>
    categories.find(c => c.slug === slug);

export const getEntriesByCategory = (name: string): DictionaryEntry[] =>
    dictionaryData
        .filter(e => e.category === name)
        .sort((a, b) => a.term_latin.localeCompare(b.term_latin));

export interface RootSummary {
    root: string;
    slug: string;
    entries: DictionaryEntry[];
}

// Root families. Only roots shared by at least two words are interesting —
// a family of one says nothing about morphology.
export const rootFamilies: RootSummary[] = (() => {
    const groups = new Map<string, DictionaryEntry[]>();
    for (const entry of dictionaryData) {
        const root = entry.root?.trim();
        if (!root) continue;
        const bucket = groups.get(root);
        if (bucket) bucket.push(entry);
        else groups.set(root, [entry]);
    }
    return [...groups.entries()]
        .filter(([, entries]) => entries.length > 1)
        .map(([root, entries]) => ({ root, slug: slugify(root), entries }))
        .sort((a, b) => b.entries.length - a.entries.length);
})();

export const getRootBySlug = (slug: string): RootSummary | undefined =>
    rootFamilies.find(r => r.slug === slug);

// A-Z index. Entries are grouped by their first Latin letter; anything
// that does not start with a-z lands in '#'.
const initialOf = (entry: DictionaryEntry): string => {
    const first = entry.term_latin.trim().charAt(0).toLowerCase();
    return /[a-z]/.test(first) ? first.toUpperCase() : '#';
};

export const ALPHABET_INDEX = [
    ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    '#',
];

export const entriesByLetter = (letter: string): DictionaryEntry[] =>
    dictionaryData
        .filter(e => initialOf(e) === letter.toUpperCase())
        .sort((a, b) => a.term_latin.localeCompare(b.term_latin));

export const letterCounts: Record<string, number> = (() => {
    const counts: Record<string, number> = {};
    for (const letter of ALPHABET_INDEX) counts[letter] = 0;
    for (const entry of dictionaryData) {
        const key = initialOf(entry);
        counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
})();

export const totalEntries = dictionaryData.length;

import { useState, useMemo } from 'react';
import Fuse, { type Expression } from 'fuse.js';
import { dictionaryData, type DictionaryEntry } from '../data/dictionary';
import { getSpellSuggestions } from '../utils/spellChecker';
import { detectScript, searchKey } from '../utils/scriptConverter';

// One loose spelling key per entry, covering its Latin and Tifinagh forms and
// any dialect variants. A query typed in any script or transcription is
// reduced to the same kind of key (see searchKey), so "aghyul", "aɣyul",
// "ⴰⵖⵢⵓⵍ" and "أغيول" all find the same word. Built once per page load.
const spellingKeys = new Map<DictionaryEntry, string[]>(
    dictionaryData.map(e => [
        e,
        [e.term_latin, e.term_tifinagh, ...Object.values(e.dialects ?? {})]
            .filter((v): v is string => !!v)
            .map(searchKey),
    ]),
);

const fuse = new Fuse(dictionaryData, {
    keys: [
        { name: 'spelling', weight: 0.4, getFn: e => spellingKeys.get(e) ?? [] },
        { name: 'definition', weight: 0.4 }, // English meaning
        { name: 'category', weight: 0.2 },
    ],
    threshold: 0.2, // Stricter fuzzy matching
    distance: 1000, // Find matches anywhere in the string
    ignoreLocation: true,
});

/** Ranked dictionary matches for a query typed in any script, or in English. */
export const searchEntries = (query: string): DictionaryEntry[] => {
    if (!query.trim()) return [];
    // Tamazight spelling in any script; English only for Latin input
    const key = searchKey(query);
    const clauses: Expression[] = key ? [{ spelling: key }] : [];
    if (detectScript(query) === 'latin') {
        clauses.push({ definition: query }, { category: query });
    }
    return clauses.length ? fuse.search({ $or: clauses }).map(r => r.item) : [];
};

const BROWSE_PAGE_SIZE = 24;

export const useSearch = () => {
    const [query, setQuery] = useState('');
    const [dialectFilter, setDialectFilter] = useState<'all' | 'tarifit' | 'kabyle' | 'tashelhit'>('all');
    const [browseCount, setBrowseCount] = useState(BROWSE_PAGE_SIZE);

    const handleSetQuery = (input: string) => {
        if (input.length > 50) return;
        setQuery(input);
        setBrowseCount(BROWSE_PAGE_SIZE); // reset pagination on new query
    };

    const loadMore = () => setBrowseCount(prev => prev + BROWSE_PAGE_SIZE);


    const results = useMemo(() => {
        try {
            let items = dictionaryData;

            // No hard cap on search — Fuse already ranks by relevance
            if (query.trim()) items = searchEntries(query);

            if (dialectFilter !== 'all') {
                items = items.filter(e => !!e.dialects?.[dialectFilter]);
            }

            // For browse (no query), slice to current page; for search, return all
            return query ? items : items.slice(0, browseCount);
        } catch (error) {
            console.error("Search failed:", error);
            return [];
        }
    }, [query, dialectFilter, browseCount]);

    const hasMore = !query && results.length < (dialectFilter === 'all'
        ? dictionaryData.length
        : dictionaryData.filter(e => !!e.dialects?.[dialectFilter]).length);

    // Spell suggestions: only compute when there are no results and query is non-empty
    const suggestions = useMemo(() => {
        if (!query || results.length > 0) return [];
        return getSpellSuggestions(query);
    }, [query, results]);

    return {
        query,
        setQuery: handleSetQuery,
        results,
        suggestions,
        dialectFilter,
        setDialectFilter,
        loadMore,
        hasMore,
    };
};


import { useState, useMemo, useDeferredValue } from 'react';
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

    // The input shows each keystroke at once; the search and the result
    // list follow at a lower priority, so typing never waits on them
    const deferredQuery = useDeferredValue(query);

    const matches = useMemo(() => {
        try {
            let items = dictionaryData;
            if (deferredQuery.trim()) items = searchEntries(deferredQuery);
            if (dialectFilter !== 'all') {
                items = items.filter(e => !!e.dialects?.[dialectFilter]);
            }
            return items;
        } catch (error) {
            console.error("Search failed:", error);
            return [];
        }
    }, [deferredQuery, dialectFilter]);

    // One letter can match thousands of words ("a" matches about 7,000),
    // and drawing a card for each froze the page. Searches are paged like
    // browsing; "Load more words" shows the next page.
    const results = useMemo(() => matches.slice(0, browseCount), [matches, browseCount]);
    const hasMore = matches.length > results.length;

    // Spell suggestions: only compute when there are no results and query is non-empty
    const suggestions = useMemo(() => {
        if (!deferredQuery || results.length > 0) return [];
        return getSpellSuggestions(deferredQuery);
    }, [deferredQuery, results]);

    return {
        query,
        /** The query `results` belong to; trails `query` while typing */
        searchedQuery: deferredQuery,
        setQuery: handleSetQuery,
        results,
        suggestions,
        dialectFilter,
        setDialectFilter,
        loadMore,
        hasMore,
    };
};


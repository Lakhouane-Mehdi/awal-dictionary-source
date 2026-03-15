import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { dictionaryData } from '../data/dictionary';
import { getSpellSuggestions } from '../utils/spellChecker';
// Imports

// Normalize specific Berber sounds for fuzzy search
// 7 -> h, 9 -> q, etc.
const normalizeQuery = (query: string) => {
    return query
        .toLowerCase()
        .replace(/7/g, 'h')
        .replace(/9/g, 'q')
        .replace(/3/g, 'aa'); // '3in' -> 'aain' typically
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

    const fuse = useMemo(() => {
        return new Fuse(dictionaryData, {
            keys: [
                { name: 'term_latin', weight: 0.3 },
                { name: 'definition', weight: 0.4 }, // Higher weight for English definition
                { name: 'term_tifinagh', weight: 0.1 },
                { name: 'category', weight: 0.2 }, // Added to support category searches
                { name: 'dialects.kabyle', weight: 0.1 },
                { name: 'dialects.tashelhit', weight: 0.1 },
                { name: 'dialects.tarifit', weight: 0.1 }
            ],
            threshold: 0.2, // Stricter fuzzy matching
            distance: 1000, // Increased distance to find matches anywhere in string
            ignoreLocation: true // Ignore location to search full string
        });
    }, []);

    const results = useMemo(() => {
        try {
            let items = dictionaryData;

            if (query) {
                const normalized = normalizeQuery(query);
                const searchInput = query.match(/[793]/) ? normalized : query;
                // No hard cap on search — Fuse already ranks by relevance
                items = fuse.search(searchInput).map(r => r.item);
            }

            if (dialectFilter !== 'all') {
                items = items.filter(e => !!e.dialects?.[dialectFilter]);
            }

            // For browse (no query), slice to current page; for search, return all
            return query ? items : items.slice(0, browseCount);
        } catch (error) {
            console.error("Search failed:", error);
            return [];
        }
    }, [query, fuse, dialectFilter, browseCount]);

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


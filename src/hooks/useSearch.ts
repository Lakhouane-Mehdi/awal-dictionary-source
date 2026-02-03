import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { dictionaryData } from '../data/dictionary';
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

export const useSearch = () => {
    const [query, setQuery] = useState('');
    const [dialectFilter, setDialectFilter] = useState<'all' | 'tarifit' | 'kabyle' | 'tashelhit'>('all');

    // Security: Input Sanitization & Limiting
    const handleSetQuery = (input: string) => {
        // Prevent huge strings (DoS)
        if (input.length > 50) return;
        // Basic sanitization (react handles escaping, but we trim)
        setQuery(input);
    };

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
            // If query is empty, return a subset to avoid rendering heavy lists immediately
            // Or typically users expect some list. Let's return the first 100 items if empty?
            // Original code returned *all*.
            if (!query) return dictionaryData.slice(0, 100);

            const normalized = normalizeQuery(query);
            const searchInput = query.match(/[793]/) ? normalized : query;

            const searchResults = fuse.search(searchInput);
            // Limit to 100 results to prevent UI freezing/crashing on generic queries
            return searchResults.slice(0, 100).map(result => result.item);
        } catch (error) {
            console.error("Search failed:", error);
            return [];
        }
    }, [query, fuse]);

    return {
        query,
        setQuery: handleSetQuery,
        results,
        dialectFilter,
        setDialectFilter
    };
};

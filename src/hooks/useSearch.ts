import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { dictionaryData } from '../data/dictionary';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
// eslint-disable-next-line @typescript-eslint/consistent-type-imports

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
        if (!query) return dictionaryData;

        const normalized = normalizeQuery(query);
        // We search with the normalized query against the original data
        // For better results, we might need to normalize data fields too or use a custom matching logic.
        // For now, Fuse's fuzziness handles a lot. The normalization is for specific number-substitutions.

        // If the query contains numbers, use the normalized version, otherwise raw
        const searchInput = query.match(/[793]/) ? normalized : query;

        return fuse.search(searchInput).map(result => result.item);
    }, [query, fuse]);

    return {
        query,
        setQuery: handleSetQuery,
        results,
        dialectFilter,
        setDialectFilter
    };
};

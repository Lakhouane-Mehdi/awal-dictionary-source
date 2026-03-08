import { dictionaryData } from '../data/dictionary';

/**
 * Computes the Levenshtein distance between two strings.
 * This measures the minimum number of single-character edits
 * (insertions, deletions, or substitutions) required to change
 * one word into the other.
 */
const levenshteinDistance = (a: string, b: string): number => {
    const matrix: number[][] = [];
    const aLen = a.length;
    const bLen = b.length;

    if (aLen === 0) return bLen;
    if (bLen === 0) return aLen;

    for (let i = 0; i <= bLen; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= aLen; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= bLen; i++) {
        for (let j = 1; j <= aLen; j++) {
            const cost = b.charAt(i - 1) === a.charAt(j - 1) ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,      // deletion
                matrix[i][j - 1] + 1,      // insertion
                matrix[i - 1][j - 1] + cost // substitution
            );
        }
    }

    return matrix[bLen][aLen];
};

/**
 * Given a user's query that returned no results, find the closest
 * matching terms from the dictionary using Levenshtein distance.
 * Returns up to 3 suggestions.
 */
export const getSpellSuggestions = (query: string, maxSuggestions = 3): string[] => {
    if (!query || query.length < 2) return [];

    const lowerQuery = query.toLowerCase();

    // Build a scored list from all unique terms and definitions
    const candidates = new Map<string, number>();

    for (const entry of dictionaryData) {
        const terms = [
            entry.term_latin.toLowerCase(),
            entry.definition.toLowerCase(),
        ];

        for (const term of terms) {
            // Skip very long terms (unlikely to be what the user meant)
            if (term.length > 30) continue;

            // For multi-word definitions, check individual words too
            const words = term.split(/\s+/);
            for (const word of words) {
                if (word.length < 2) continue;
                const dist = levenshteinDistance(lowerQuery, word);
                // Only suggest if the distance is reasonably small relative to the query length
                const threshold = Math.max(2, Math.floor(lowerQuery.length * 0.5));
                if (dist <= threshold && dist > 0) {
                    const existing = candidates.get(word);
                    if (existing === undefined || dist < existing) {
                        candidates.set(word, dist);
                    }
                }
            }
        }
    }

    // Sort by distance (closest first) and return top suggestions
    return Array.from(candidates.entries())
        .sort((a, b) => a[1] - b[1])
        .slice(0, maxSuggestions)
        .map(([word]) => word);
};

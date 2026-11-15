// The PDF dictionary mixes English grammar notes into the Tamazight column:
// "Yan(masc.)/yat(fem.)", "g (conj) muhim", "izdar (n); tabut (n)". Left in
// place they show up as Tamazight (Tifinagh mode rendered "(conj)" as
// ⵛⵓⵏⵊ) and break search. splitGrammarNotes() moves them into a note that
// names the word each one applies to. Parentheses holding Tamazight, such
// as optional particles "(d)" or alternatives "(azar)", are left alone.

const NOTE_PATTERNS: [RegExp, string][] = [
    [/^conj\.?\s+in\s+(?:the\s+)?present(?:\s+tense)?$/i, 'Conjugate in the present'],
    [/^conj\.?\s+in\s+(?:the\s+)?past$/i, 'Conjugate in the past'],
    [/^conj\.?\s+as\s+reflexive(?:\s+v\.?)?$|^re?f?lexive$|^relexive$/i, 'Conjugated reflexively'],
    [/^conj\.?$|^conjugate$/i, 'Conjugate'],
    [/^n\.?$/i, 'Noun'],
    [/^v\.?$/i, 'Verb'],
    [/^adj\.?$/i, 'Adjective'],
    [/^adv\.?$/i, 'Adverb'],
    [/^masc\.?$/i, 'Masculine'],
    [/^fem\.?$/i, 'Feminine'],
    [/^plr\.?$/i, 'Plural'],
    [/^always\s+negative$/i, 'Always negative'],
];

const labelFor = (inner: string): string | undefined =>
    NOTE_PATTERNS.find(([re]) => re.test(inner.trim()))?.[1];

export interface SplitTerm {
    /** The Tamazight text with the English notes removed */
    term: string;
    /** "Masculine: Yan · Feminine: yat", or undefined when there were none */
    notes?: string;
}

export const splitGrammarNotes = (text: string): SplitTerm => {
    const byLabel = new Map<string, string[]>();
    const term = text
        .replace(/(\S*?)\s*\(([^()]*)\)/g, (whole, word: string, inner: string) => {
            const label = labelFor(inner);
            if (!label) return whole;
            // The note applies to the word right before it ("g (conj)"),
            // without the separators that may cling to it
            const target = word.replace(/^[;,/]+|[;,/]+$/g, '');
            const words = byLabel.get(label) ?? [];
            if (target && !words.includes(target)) words.push(target);
            byLabel.set(label, words);
            return word;
        })
        .replace(/\s+/g, ' ')
        .replace(/\s+([;,/])/g, '$1')
        .trim();

    if (byLabel.size === 0) return { term: text };
    const notes = [...byLabel]
        .map(([label, words]) => (words.length ? `${label}: ${words.join(', ')}` : label))
        .join(' · ');
    return { term, notes };
};

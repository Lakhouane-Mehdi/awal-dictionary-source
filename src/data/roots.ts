// Consonantal roots. Tamazight builds related words by fitting vowel
// patterns and affixes around a fixed skeleton of consonants: the verb
// mɛdr "to be crazy", amɛdur "crazy person" and timmiɛdrt "craziness" all
// share M-Ɛ-D-R.
//
// Roots are found mechanically, so a family is only accepted when meaning
// backs it up. Many unrelated words share two or three consonants (azul
// "hello", azl "to run" and tazallit "prayer" all reduce to Z-L), so:
// - every family is anchored on a verb;
// - all of its verbs must share a meaning word, or the skeleton is taken to
//   be two different roots that happen to look alike, and dropped;
// - other words join only when their meaning shares a word stem with the
//   verbs' ("crazy" / "craziness", "move" / "movement").
// This misses some real families (lɛaṣir "juice" from ɛṣr "to squeeze"),
// but it does not invent false ones.

import { normalizeLatin } from '../utils/scriptConverter';

interface RootCandidate {
    term_latin: string;
    definition: string;
    category?: string;
    conjugation?: object;
    root?: string;
}

const VOWEL = /[aeiouo]/;

/**
 * The consonant skeleton of a single Tamazight word, or null when the term
 * is not a single word or its skeleton is too short or long to be a root.
 */
export const rootKey = (term: string, isVerb: boolean): string | null => {
    let word = normalizeLatin(term.trim().toLowerCase()).replace(/[*'’ʷ.-]/g, '');
    if (!word || /[\s;,/()0-9]/.test(word)) return null;
    // The Arabic article of Darija loans: lmrḍ "sickness" is M-R-Ḍ
    if (/^l[^aeiou]/.test(word)) word = word.slice(1);
    if (!isVerb) {
        // Feminine t...t (tamɣart), feminine plural ti...in, masculine plural i...n
        if (/^t.+t$/.test(word) && word.length > 3) word = word.slice(1, -1);
        else if (/^ti.+in$/.test(word)) word = word.slice(2, -2);
        if (/^i.+(en|an|in|n)$/.test(word) && word.length > 4) word = word.replace(/(en|an|in|n)$/, '');
    }
    const consonants: string[] = [];
    for (const ch of word) {
        // Doubled consonants are one radical: ṣṣbr is Ṣ-B-R
        if (!VOWEL.test(ch) && consonants[consonants.length - 1] !== ch) consonants.push(ch);
    }
    return consonants.length >= 2 && consonants.length <= 4 ? consonants.join('') : null;
};

// Letters written as digraphs in the root display, matching the hand-written
// roots ("M-Gh-R") and keeping their existing URLs
const DISPLAY: Record<string, string> = { ɣ: 'Gh', x: 'Kh', c: 'Sh' };

/** "mɣr" -> "M-Gh-R" */
export const formatRoot = (key: string): string =>
    Array.from(key, ch => DISPLAY[ch] ?? ch.toUpperCase()).join('-');

/** The key a displayed root stands for: "M-Gh-R" -> "mɣr" */
export const keyOfRoot = (root: string): string => normalizeLatin(root.replace(/-/g, '').toLowerCase());

/**
 * URL slug for a root. Unlike the general slugify, it keeps the emphatic
 * and pharyngeal letters ("Ḍ-Ɛ-F" -> "d-ain-f") instead of dropping them.
 */
export const rootSlug = (root: string): string =>
    root
        .toLowerCase()
        .replace(/ɛ/g, 'ain')
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

const STOP_WORDS = new Set(
    'to be the a an of in on for with and or something someone st sb one oneself it is get make become have do up out off at by from into very not n v adj i e g esp etc'.split(' '),
);

/** Four-letter stems of a definition's meaningful words */
const meaningStems = (definition: string): Set<string> =>
    new Set(
        definition
            .toLowerCase()
            .replace(/\([^)]*\)/g, ' ')
            .split(/[^a-z]+/)
            .filter(w => w && !STOP_WORDS.has(w))
            .map(w => w.slice(0, 4)),
    );

const overlaps = (a: Set<string>, b: Set<string>) => [...a].some(stem => b.has(stem));

const isVerbEntry = (e: RootCandidate) => !!e.conjugation || /^to /i.test(e.definition.trim());

/** True when every verb is linked to the others through shared meaning words */
const verbsAgree = (stems: Set<string>[]): boolean => {
    const reached = new Set([0]);
    let grew = true;
    while (grew) {
        grew = false;
        stems.forEach((s, i) => {
            if (!reached.has(i) && [...reached].some(j => overlaps(s, stems[j]))) {
                reached.add(i);
                grew = true;
            }
        });
    }
    return reached.size === stems.length;
};

// Proper names and set phrases have no morphology to share
const SKIPPED_CATEGORIES = new Set(['Countries', 'God Phrases']);

/**
 * Works out root families and returns the root to give each member.
 * Entries that already have a hand-written root keep it and are left out.
 */
export const findRootFamilies = <T extends RootCandidate>(entries: T[]): Map<T, string> => {
    const byKey = new Map<string, T[]>();
    for (const entry of entries) {
        if (entry.root || SKIPPED_CATEGORIES.has(entry.category ?? '')) continue;
        const key = rootKey(entry.term_latin, isVerbEntry(entry));
        if (!key) continue;
        const group = byKey.get(key);
        if (group) group.push(entry);
        else byKey.set(key, [entry]);
    }

    const roots = new Map<T, string>();
    for (const [key, group] of byKey) {
        const verbs = group.filter(isVerbEntry);
        if (!verbs.length) continue;
        const verbStems = verbs.map(v => meaningStems(v.definition));
        if (!verbsAgree(verbStems)) continue;
        const familyStems = new Set(verbStems.flatMap(s => [...s]));
        const family = group.filter(e => verbs.includes(e) || overlaps(meaningStems(e.definition), familyStems));
        // Two spellings of one word are not a family
        if (new Set(family.map(e => e.term_latin.toLowerCase())).size < 2) continue;
        const root = formatRoot(key);
        for (const entry of family) roots.set(entry, root);
    }
    return roots;
};

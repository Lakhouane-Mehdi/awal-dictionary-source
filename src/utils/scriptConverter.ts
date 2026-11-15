// Converts Tamazight between Latin, Tifinagh and Arabic script, in every
// direction. Standard IRCAM Latin (a b c č d ḍ e ɛ f g ǧ ɣ h ḥ i j k l m n q
// r ṛ s ṣ t ṭ u w x y z ẓ) is the hub: every conversion goes through it.
//
// Input Latin can be messy. The PDF dictionary uses its own transcription
// (sh, gh, kh, ş, ţ, ď, o, p, v), and people type chat-style numerals
// (7 for ḥ, 9 for q, 3 for ɛ). normalizeLatin() folds all of that into
// IRCAM Latin first.

export type Script = 'latin' | 'tifinagh' | 'arabic';

const TIFINAGH_RE = /[ⴰ-⵿]/;
const ARABIC_RE = /[؀-ۿݐ-ݿ]/;

export const detectScript = (text: string): Script =>
    TIFINAGH_RE.test(text) ? 'tifinagh' : ARABIC_RE.test(text) ? 'arabic' : 'latin';

// ---------------------------------------------------------------------------
// Latin normalisation
// ---------------------------------------------------------------------------

// Longest first, so digraphs win over single letters.
const LATIN_FOLDS: [string, string][] = [
    ['gh', 'ɣ'], ['kh', 'x'], ['sh', 'c'], ['ch', 'c'],
    ['ş', 'ṣ'], ['ţ', 'ṭ'], ['ď', 'ḍ'], ['š', 'c'], ['ġ', 'ɣ'], ['ǧ', 'ǧ'],
    ['ɣ', 'ɣ'], ['ε', 'ɛ'], ['ʕ', 'ɛ'], ['ع', 'ɛ'],
    ['o', 'u'], ['p', 'b'], ['v', 'f'],
    ['7', 'ḥ'], ['9', 'q'], ['3', 'ɛ'], ['5', 'x'],
    ['ʷ', 'ʷ'], ["'", ''], ['’', ''],
];
const FOLD_KEYS = LATIN_FOLDS.map(([k]) => k).sort((a, b) => b.length - a.length);
const FOLD_MAP = new Map(LATIN_FOLDS);

/** Lowercases and folds any Latin transcription into IRCAM Latin. */
export const normalizeLatin = (text: string): string => {
    const s = text.toLowerCase().normalize('NFC');
    let out = '';
    for (let i = 0; i < s.length;) {
        const key = FOLD_KEYS.find(k => s.startsWith(k, i));
        if (key) {
            out += FOLD_MAP.get(key);
            i += key.length;
        } else {
            out += s[i];
            i += 1;
        }
    }
    return out;
};

/**
 * The PDF dictionary writes ḥ (Arabic ح) as a capital "H", as in "slHil" or
 * "lHsab". Generic conversion lowercases everything, so apply this to PDF
 * text first. All-caps words such as "ALLAH" are left alone.
 */
export const pdfLatinToIrcam = (text: string): string =>
    text.replace(/\S+/g, word => (word === word.toUpperCase() ? word : word.replace(/H/g, 'ḥ')));

// ---------------------------------------------------------------------------
// Latin <-> Tifinagh
// ---------------------------------------------------------------------------

const LATIN_TO_TIFINAGH: Record<string, string> = {
    a: 'ⴰ', b: 'ⴱ', c: 'ⵛ', č: 'ⵞ', d: 'ⴷ', ḍ: 'ⴹ', e: 'ⴻ', ɛ: 'ⵄ', f: 'ⴼ',
    g: 'ⴳ', ǧ: 'ⴵ', ɣ: 'ⵖ', h: 'ⵀ', ḥ: 'ⵃ', i: 'ⵉ', j: 'ⵊ', k: 'ⴽ', l: 'ⵍ',
    m: 'ⵎ', n: 'ⵏ', q: 'ⵇ', r: 'ⵔ', ṛ: 'ⵕ', s: 'ⵙ', ṣ: 'ⵚ', t: 'ⵜ', ṭ: 'ⵟ',
    u: 'ⵓ', w: 'ⵡ', x: 'ⵅ', y: 'ⵢ', z: 'ⵣ', ẓ: 'ⵥ', ʷ: 'ⵯ',
};

const TIFINAGH_TO_LATIN: Record<string, string> = Object.fromEntries(
    Object.entries(LATIN_TO_TIFINAGH).map(([lat, tif]) => [tif, lat]),
);
// Variant letters that appear in Tifinagh text but have no letter of their own above
Object.assign(TIFINAGH_TO_LATIN, {
    'ⴶ': 'ǧ', 'ⴴ': 'ɣ', 'ⴸ': 'd', 'ⴺ': 'ḍ', 'ⵈ': 'q', 'ⵗ': 'ɣ',
    'ⵘ': 'ɣ', 'ⵝ': 't', 'ⵠ': 'v', 'ⵦ': 'y', 'ⵧ': 'y', 'ⵐ': 'ŋ', 'ⵒ': 'p',
});

// Standard Tifinagh spelling leaves out the schwa (Nekk -> ⵏⴽ, Yemma -> ⵢⵎⵎⴰ)
// and Tamazight has no long vowels, so "aa" in a loose spelling is one ⴰ.
const tifinaghSpelling = (latin: string): string =>
    latin
        .replace(/\p{L}+/gu, word => (word === 'e' ? word : word.replace(/e/g, '')))
        .replace(/([aiu])\1+/g, '$1');

const latinToTifinagh = (latin: string): string =>
    Array.from(tifinaghSpelling(normalizeLatin(latin)), ch => LATIN_TO_TIFINAGH[ch] ?? ch).join('');

const tifinaghToLatin = (tif: string): string =>
    Array.from(tif, ch => TIFINAGH_TO_LATIN[ch] ?? ch).join('');

// ---------------------------------------------------------------------------
// Latin <-> Arabic
// ---------------------------------------------------------------------------

const LATIN_TO_ARABIC: Record<string, string> = {
    b: 'ب', c: 'ش', č: 'تش', d: 'د', ḍ: 'ض', ɛ: 'ع', f: 'ف', g: 'گ', ǧ: 'ج',
    ɣ: 'غ', h: 'ه', ḥ: 'ح', j: 'ج', k: 'ك', l: 'ل', m: 'م', n: 'ن', q: 'ق',
    r: 'ر', ṛ: 'ر', s: 'س', ṣ: 'ص', t: 'ت', ṭ: 'ط', w: 'و', x: 'خ', y: 'ي',
    z: 'ز', ẓ: 'ز', ʷ: 'و',
    a: 'ا', i: 'ي', u: 'و', e: '',
};
const SHADDA = 'ّ';
const LATIN_VOWELS = new Set(['a', 'i', 'u', 'e']);
// Word-initial vowels carry a hamza seat: Azul -> أزول, Imi -> إمي
const INITIAL_VOWEL: Record<string, string> = { a: 'أ', i: 'إ', u: 'أو', e: 'أ' };

const latinToArabic = (latin: string): string => {
    const s = Array.from(normalizeLatin(latin));
    let out = '';
    for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        const atWordStart = i === 0 || !/\p{L}/u.test(s[i - 1]);
        if (atWordStart && INITIAL_VOWEL[ch]) {
            out += INITIAL_VOWEL[ch];
            continue;
        }
        // A doubled consonant becomes one letter with a shadda: dd -> دّ
        if (!LATIN_VOWELS.has(ch) && s[i + 1] === ch && LATIN_TO_ARABIC[ch]) {
            out += LATIN_TO_ARABIC[ch] + SHADDA;
            i++;
            continue;
        }
        out += LATIN_TO_ARABIC[ch] ?? ch;
    }
    return out;
};

const ARABIC_TO_LATIN: Record<string, string> = {
    'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'a', 'ٱ': 'a', 'ى': 'a', 'ة': 't',
    'ب': 'b', 'ت': 't', 'ث': 't', 'ج': 'j', 'ح': 'ḥ', 'خ': 'x', 'د': 'd',
    'ذ': 'd', 'ر': 'r', 'ز': 'z', 'ژ': 'ẓ', 'س': 's', 'ش': 'c', 'ص': 'ṣ',
    'ض': 'ḍ', 'ط': 'ṭ', 'ظ': 'ḍ', 'ع': 'ɛ', 'غ': 'ɣ', 'ف': 'f', 'ڤ': 'v',
    'ق': 'q', 'ك': 'k', 'گ': 'g', 'ݣ': 'g', 'ڭ': 'g', 'ل': 'l', 'م': 'm',
    'ن': 'n', 'ه': 'h', 'ء': '', 'ؤ': 'u', 'ئ': 'i',
};
// و and ي read as consonants (w / y) when another vowel letter follows
const ARABIC_VOWEL_LETTERS = new Set(['ا', 'أ', 'إ', 'آ', 'ى', 'و', 'ي']);
const ARABIC_DIACRITICS = /[ً-ِْ-ٰٟ]/g;

const arabicToLatin = (arabic: string): string => {
    const s = Array.from(arabic.replace(ARABIC_DIACRITICS, '').replace(/ـ/g, ''));
    let out = '';
    for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        if (ch === SHADDA) {
            // Double the previous consonant
            const prev = out.slice(-1);
            if (prev) out += prev;
            continue;
        }
        if (ch === 'و' || ch === 'ي') {
            // A consonant (w / y) at the start of a word or before a vowel,
            // otherwise a vowel (u / i)
            const atStart = i === 0 || !/\p{L}/u.test(s[i - 1]);
            const beforeVowel = ARABIC_VOWEL_LETTERS.has(s[i + 1] ?? '');
            const consonant = atStart || beforeVowel;
            out += ch === 'و' ? (consonant ? 'w' : 'u') : (consonant ? 'y' : 'i');
            continue;
        }
        // Initial أو / أي spell a vowel: أوشن -> ucen
        if ((ch === 'أ' || ch === 'ا') && (s[i + 1] === 'و' || s[i + 1] === 'ي') && (i === 0 || !/\p{L}/u.test(s[i - 1]))) {
            out += s[i + 1] === 'و' ? 'u' : 'i';
            i++;
            continue;
        }
        out += ARABIC_TO_LATIN[ch] ?? ch;
    }
    return out;
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Any script -> IRCAM Latin. */
export const toLatin = (text: string): string => {
    switch (detectScript(text)) {
        case 'tifinagh': return tifinaghToLatin(text);
        case 'arabic': return arabicToLatin(text);
        default: return normalizeLatin(text);
    }
};

/**
 * Converts text to the target script, whatever script it is written in.
 * Text already in the target script is returned unchanged, so Latin stays
 * exactly as the dictionary spells it.
 */
export const convertScript = (text: string, target: Script): string => {
    if (!text) return '';
    const source = detectScript(text);
    if (source === target) return text;
    const latin = source === 'latin' ? text : toLatin(text);
    switch (target) {
        case 'latin': return latin;
        case 'tifinagh': return latinToTifinagh(latin);
        case 'arabic': return latinToArabic(latin);
    }
};

/**
 * A loose spelling key for search. Two spellings of the same word give the
 * same key whatever script or transcription they use: "aɣyul", "aghyul",
 * "ⴰⵖⵢⵓⵍ" and "أغيول" all become "agiul". Emphatics lose their dots, y/w
 * fold into i/u (Arabic script can't tell them apart), doubled letters
 * collapse, and schwa, ɛ, spaces and hyphens drop out.
 */
export const searchKey = (text: string): string =>
    toLatin(text)
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/ɣ/g, 'g').replace(/ǧ/g, 'j').replace(/č/g, 'c').replace(/ʷ/g, '')
        .replace(/[ɛe\s\-.'’]/g, '')
        .replace(/y/g, 'i').replace(/w/g, 'u')
        .replace(/(.)\1+/g, '$1');


// Basic mapping for Latin <-> Tifinagh <-> Arabic (Simplified)

const latinToTifinaghMap: Record<string, string> = {
    'a': 'ⴰ', 'b': 'ⴱ', 'c': 'ⵛ', 'd': 'ⴷ', 'e': 'ⴻ', 'f': 'ⴼ',
    'g': 'ⴳ', 'h': 'ⵀ', 'i': 'ⵉ', 'j': 'ⵊ', 'k': 'ⴽ', 'l': 'ⵍ',
    'm': 'ⵎ', 'n': 'ⵏ', 'q': 'ⵇ', 'r': 'ⵔ', 's': 'ⵙ', 't': 'ⵜ',
    'u': 'ⵓ', 'w': 'ⵡ', 'x': 'ⵅ', 'y': 'ⵢ', 'z': 'ⵣ',
    'gh': 'ⵖ', 'kh': 'ⵅ', 'sh': 'ⵛ', 'ch': 'ⵛ', // Digraphs
    '7': 'ⵃ', '9': 'ⵇ', '5': 'ⵅ', // Numeric
};

// Reverse map would be needed for full 2-way, but we usually store Latin as source of truth.

const latinToArabicMap: Record<string, string> = {
    'a': 'ا', 'b': 'ب', 'c': 'ش', 'd': 'د', 'e': 'ي', 'f': 'ف',
    'g': 'گ', 'h': 'ه', 'i': 'ي', 'j': 'ج', 'k': 'ك', 'l': 'ل',
    'm': 'م', 'n': 'ن', 'q': 'ق', 'r': 'ر', 's': 'س', 't': 'ت',
    'u': 'و', 'w': 'و', 'x': 'خ', 'y': 'ي', 'z': 'ز',
    'gh': 'غ', 'kh': 'خ', 'sh': 'ش',
};

// Helper to replace longest keys first (for digraphs)
const replacer = (text: string, map: Record<string, string>) => {
    let result = text.toLowerCase();
    // Sort keys by length desc
    const keys = Object.keys(map).sort((a, b) => b.length - a.length);

    for (const key of keys) {
        const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        result = result.replace(new RegExp(escaped, 'g'), map[key]);
    }
    return result;
};

const isTifinagh = (text: string) => /[\u2D30-\u2D7F]/.test(text);
const isArabic = (text: string) => /[\u0600-\u06FF]/.test(text);

export const convertScript = (text: string, target: 'latin' | 'tifinagh' | 'arabic'): string => {
    if (!text) return '';

    // If text is already in target script, return as is (heuristic)
    if (target === 'tifinagh' && isTifinagh(text)) return text;
    if (target === 'arabic' && isArabic(text)) return text;
    if (target === 'latin' && !isTifinagh(text) && !isArabic(text)) return text;

    // TODO: Implement Tifinagh -> Latin reverse mapping if needed. 
    // For now, we assume source is usually Latin.
    // If source is Tifinagh and we want Latin, we return it as is (or generic error) because we lack the reverse map.
    if (isTifinagh(text) && target !== 'tifinagh') return text;

    if (target === 'latin') return text; // Fallback
    if (target === 'tifinagh') return replacer(text, latinToTifinaghMap);
    if (target === 'arabic') return replacer(text, latinToArabicMap);
    return text;
};

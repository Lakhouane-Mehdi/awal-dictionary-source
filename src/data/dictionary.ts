import importedData from './dictionary.json';
import ircamVerbData from './ircam_verbs.json';
import wiktionaryData from './wiktionary_words.json';
import { convertScript } from '../utils/scriptConverter';

// Type for the IRCAM verb JSON entries
interface IrcamVerb {
    tifinagh: string;
    english: string;
}

// Type for Wiktionary JSON entries
interface WiktionaryWord {
    tifinagh: string;
    definition: string;
}

export interface DictionaryEntry {
    id: string;
    term_latin: string;
    term_tifinagh: string;
    term_arabic?: string;
    definition: string;
    dialects?: {
        tarifit?: string;
        kabyle?: string;
        tashelhit?: string;
        tuareg?: string;
    };
    category?: string;
    cultural_image?: string;
    root?: string; // e.g. "M-Gh-R"
    etymology?: string; // Cultural explanation of the root
    conjugation?: {
        preterite: string;
        intensive: string;
        future: string;
        aorist?: string;
    };
    source?: string;
}

// The PDF text extraction mangled the Tamazight letter "ɛ" (ayn) into stray
// Arabic glyphs — either the presentation-form ligature U+FE49 or the plain
// U+0639, usually padded with spaces ("rb ﻉع ta" instead of "rbɛta").
// This affects ~645 entries, including every number from 10 upward.
const repairAyn = (text: string): string =>
    text
        .replace(/\s*ﻉ\s*ع\s*/g, 'ɛ')
        .replace(/\s*[ﻉع]\s*/g, 'ɛ')
        .replace(/\s{2,}/g, ' ')
        .trim();

const importedEntries: DictionaryEntry[] = importedData.map((item: Record<string, string | undefined>, index: number) => {
    // Determine Latin term and Definition based on section usually, but our JSON normalized it:
    // english col -> definition, tamazight col -> term_latin
    // Note: The PDF parser output puts 'english' key as English text and 'tamazight' key as Tamazight text

    const termLatin = repairAyn(item.tamazight || '');
    const def = (item.english || '').trim();

    // Determine source section for potential category inference
    const section = item.section || 'General';
    const dialect = item.dialect || 'General';

    // The raw sections ('eng-tam'/'tam-eng') only describe which half of the
    // PDF a row came from — they are meaningless as browsable categories, so
    // infer a real one from the definition instead.
    let category: string;
    if (section === 'eng-tam' || section === 'tam-eng') category = categorizeWord(def);
    else category = section; // 'Verbs', 'Countries', 'God Phrases', etc.

    return {
        id: `imp_${index}`,
        term_latin: termLatin,
        term_tifinagh: convertScript(termLatin, 'tifinagh'),
        term_arabic: convertScript(termLatin, 'arabic'),
        definition: def,
        category: category,
        source: 'PDF Import',
        dialects: {
            tashelhit: dialect === 'Zaouiat Ahansal' ? termLatin : undefined,
            // proper way: maybe add a 'region' field or 'dialect_tag'. 
            // for now, let's put it in source or a new field if interface allows.
            // Interface has 'dialects' object. Let's just use 'source' for the dialect name to be safe without breaking types.
        }
    };
}).filter((item: DictionaryEntry) => item.term_latin.length > 0 && item.definition.length > 0 && item.definition !== 'English' && item.definition !== 'Tamazight');

const manualEntries: DictionaryEntry[] = [
    // --- GREETINGS ---
    {
        id: 'g1',
        term_latin: 'Azul',
        term_tifinagh: 'ⴰⵣⵓⵍ',
        term_arabic: 'أزول',
        definition: 'Hello / Welcome',
        category: 'Greetings',
        root: 'Z-L',
        etymology: 'Often interpreted as "Az" (Come near) + "Ul" (Heart). Literally: "Come close to my heart".'
    },
    { id: 'g2', term_latin: 'Tanmirt', term_tifinagh: 'ⵜⴰⵏⵎⵉⵔⵜ', term_arabic: 'تنميرت', definition: 'Thank you', category: 'Greetings' },

    {
        id: 'f6',
        term_latin: 'Tamghart',
        term_tifinagh: 'ⵜⴰⵎⵖⴰⵔⵜ',
        definition: 'Woman / Wife',
        category: 'Family',
        root: 'M-Gh-R',
        etymology: 'Shares the root M-Gh-R with "Imghur" (To be great/big). Historically implies "The Great One" or Matriarch of the family.'
    },

    // --- ADJECTIVES ---
    {
        id: 'adj1',
        term_latin: 'Imghur',
        term_tifinagh: 'ⵉⵎⵖⵓⵔ',
        definition: 'Big / Large',
        category: 'Adjectives',
        root: 'M-Gh-R',
        etymology: 'Derived from the root concept of greatness, seniority, or physical size.'
    },
    { id: 'g3', term_latin: 'Sbah lkhir', term_tifinagh: 'ⵚⴱⴰⵃ ⵍⵅⵉⵔ', definition: 'Good morning', category: 'Greetings' },
    { id: 'g4', term_latin: 'Timinsiwin', term_tifinagh: 'ⵜⵉⵎⵉⵏⵙⵉⵡⵉⵏ', definition: 'Good evening', category: 'Greetings' },
    { id: 'g5', term_latin: 'Ar tufat', term_tifinagh: 'ⴰⵔ ⵜⵓⴼⴰⵜ', definition: 'See you later / Until next time', category: 'Greetings' },

    // --- PRONOUNS ---
    { id: 'p1', term_latin: 'Nekk', term_tifinagh: 'ⵏⴽ', definition: 'I (Me)', category: 'Pronouns' },
    { id: 'p2', term_latin: 'Kiyyi', term_tifinagh: 'ⴽⵢⵢⵉ', definition: 'You (Masculine)', category: 'Pronouns' },
    { id: 'p3', term_latin: 'Kemmi', term_tifinagh: 'ⴽⵎⵎⵉ', definition: 'You (Feminine)', category: 'Pronouns' },
    { id: 'p4', term_latin: 'Ntta', term_tifinagh: 'ⵏⵜⵜⴰ', definition: 'He', category: 'Pronouns' },
    { id: 'p5', term_latin: 'Nttat', term_tifinagh: 'ⵏⵜⵜⴰⵜ', definition: 'She', category: 'Pronouns' },

    // --- FAMILY ---
    { id: 'f1', term_latin: 'Baba', term_tifinagh: 'ⴱⴰⴱⴰ', definition: 'Father', category: 'Family' },
    { id: 'f2', term_latin: 'Yemma', term_tifinagh: 'ⵢⵎⵎⴰ', definition: 'Mother', category: 'Family' },
    { id: 'f3', term_latin: 'Gma', term_tifinagh: 'ⴳⵎⴰ', definition: 'Brother', category: 'Family' },
    { id: 'f4', term_latin: 'Ultma', term_tifinagh: 'ⵓⵍⵜⵎⴰ', definition: 'Sister', category: 'Family' },
    { id: 'f5', term_latin: 'Argaz', term_tifinagh: 'ⴰⵔⴳⴰⵣ', definition: 'Man / Husband', category: 'Family' },
    { id: 'f7', term_latin: 'Afrukh', term_tifinagh: 'ⴰⴼⵔⵓⵅ', definition: 'Boy', category: 'Family' },
    { id: 'f8', term_latin: 'Tafrukht', term_tifinagh: 'ⵜⴰⴼⵔⵓⵅⵜ', definition: 'Girl', category: 'Family' },

    // --- NATURE ---
    { id: 'n1', term_latin: 'Aman', term_tifinagh: 'ⴰⵎⴰⵏ', definition: 'Water', category: 'Nature' },
    { id: 'n2', term_latin: 'Akal', term_tifinagh: 'ⴰⴽⴰⵍ', definition: 'Earth / Soil / Land', category: 'Nature' },
    { id: 'n3', term_latin: 'Tafukt', term_tifinagh: 'ⵜⴰⴼⵓⴽⵜ', definition: 'Sun', category: 'Nature' },
    { id: 'n4', term_latin: 'Ayyur', term_tifinagh: 'ⴰⵢⵢⵓⵔ', definition: 'Moon', category: 'Nature' },
    { id: 'n5', term_latin: 'Itri', term_tifinagh: 'ⵉⵜⵔⵉ', definition: 'Star', category: 'Nature' },
    { id: 'n6', term_latin: 'Adrar', term_tifinagh: 'ⴰⴷⵔⴰⵔ', definition: 'Mountain', category: 'Nature' },
    { id: 'n7', term_latin: 'Ilel', term_tifinagh: 'ⵉⵍⵍ', definition: 'Sea / Ocean', category: 'Nature' },
    { id: 'n8', term_latin: 'Asif', term_tifinagh: 'ⴰⵙⵉⴼ', definition: 'River', category: 'Nature' },
    { id: 'n9', term_latin: 'Ignna', term_tifinagh: 'ⵉⴳⵏⵏⴰ', definition: 'Sky', category: 'Nature' },
    { id: 'n10', term_latin: 'Tagant', term_tifinagh: 'ⵜⴰⴳⴰⵏⵜ', definition: 'Forest', category: 'Nature' },

    // --- PLACES ---
    { id: 'pl1', term_latin: 'Taddart', term_tifinagh: 'ⵜⴰⴷⴷⴰⵔⵜ', definition: 'Home / House / Village', category: 'Places' },
    { id: 'pl2', term_latin: 'Axxam', term_tifinagh: 'ⴰⵅⵅⴰⵎ', definition: 'House (Kabyle)', category: 'Places' },

    // --- FOOD ---
    { id: 'fo1', term_latin: 'Aghrum', term_tifinagh: 'ⴰⵖⵔⵓⵎ', definition: 'Bread', category: 'Food' },
    { id: 'fo2', term_latin: 'Udi', term_tifinagh: 'ⵓⴷⵉ', definition: 'Butter', category: 'Food' },
    { id: 'fo3', term_latin: 'Aatay', term_tifinagh: 'ⴰⵜⴰⵢ', definition: 'Tea', category: 'Food' },
    { id: 'fo4', term_latin: 'Amalu', term_tifinagh: 'ⴰⵎⵍⵓ', definition: 'Amlou (Almond dip)', category: 'Food' },
    { id: 'fo5', term_latin: 'Tisent', term_tifinagh: 'ⵜⵉⵙⵏⵜ', definition: 'Salt', category: 'Food' },
    { id: 'fo6', term_latin: 'Askif', term_tifinagh: 'ⴰⵙⴽⵉⴼ', definition: 'Soup', category: 'Food' },
    { id: 'fo7', term_latin: 'Seksu', term_tifinagh: 'ⵙⴽⵙⵓ', definition: 'Couscous', category: 'Food' },
    { id: 'fo8', term_latin: 'Aghi', term_tifinagh: 'ⴰⵖⵉ', definition: 'Milk / Buttermilk', category: 'Food' },

    // --- NUMBERS ---
    { id: 'num1', term_latin: 'Yan', term_tifinagh: 'ⵢⴰⵏ', definition: 'One', category: 'Numbers' },
    { id: 'num2', term_latin: 'Sin', term_tifinagh: 'ⵙⵉⵏ', definition: 'Two', category: 'Numbers' },
    { id: 'num3', term_latin: 'Krad', term_tifinagh: 'ⴽⵕⴰⴹ', definition: 'Three', category: 'Numbers' },
    { id: 'num4', term_latin: 'Kuz', term_tifinagh: 'ⴽⵓⵥ', definition: 'Four', category: 'Numbers' },
    { id: 'num5', term_latin: 'Semmus', term_tifinagh: 'ⵙⵎⵎⵓⵙ', definition: 'Five', category: 'Numbers' },
    { id: 'num6', term_latin: 'Sdis', term_tifinagh: 'ⵙⴹⵉⵙ', definition: 'Six', category: 'Numbers' },
    { id: 'num7', term_latin: 'Sa', term_tifinagh: 'ⵙⴰ', definition: 'Seven', category: 'Numbers' },
    { id: 'num8', term_latin: 'Tam', term_tifinagh: 'ⵜⴰⵎ', definition: 'Eight', category: 'Numbers' },
    { id: 'num9', term_latin: 'Tza', term_tifinagh: 'ⵜⵥⴰ', definition: 'Nine', category: 'Numbers' },
    { id: 'num10', term_latin: 'Mraw', term_tifinagh: 'ⵎⵔⴰⵡ', definition: 'Ten', category: 'Numbers' },

    // --- ANIMALS ---
    { id: 'a1', term_latin: 'Aydi', term_tifinagh: 'ⴰⵢⴷⵉ', definition: 'Dog', category: 'Animals' },
    { id: 'a2', term_latin: 'Amuch', term_tifinagh: 'ⴰⵎⵓⵛ', definition: 'Cat', category: 'Animals' },
    { id: 'a3', term_latin: 'Ayyis', term_tifinagh: 'ⴰⵢⵢⵉⵙ', definition: 'Horse', category: 'Animals' },
    { id: 'a4', term_latin: 'Izm', term_tifinagh: 'ⵉⵣⵎ', definition: 'Lion', category: 'Animals' },
    { id: 'a5', term_latin: 'Aghyul', term_tifinagh: 'ⴰⵖⵢⵓⵍ', definition: 'Donkey', category: 'Animals' },
    { id: 'a6', term_latin: 'Tizwit', term_tifinagh: 'ⵜⵉⵣⵡⵉⵜ', definition: 'Bee', category: 'Animals' },

    // --- TIME ---
    { id: 't1', term_latin: 'Ass', term_tifinagh: 'ⴰⵙⵙ', definition: 'Day', category: 'Time' },
    { id: 't2', term_latin: 'Id', term_tifinagh: 'ⵉⴹ', definition: 'Night', category: 'Time' },
    { id: 't3', term_latin: 'Azemz', term_tifinagh: 'ⴰⵣⵎⵣ', definition: 'Time', category: 'Time' },
    { id: 't4', term_latin: 'Asggwas', term_tifinagh: 'ⴰⵙⴳⴳⵯⴰⵙ', definition: 'Year', category: 'Time' },

    // --- ACTIONS (VERBS) ---
    {
        id: 'v1',
        term_latin: 'Ech',
        term_tifinagh: 'ⵢⵛ',
        definition: 'To Eat',
        category: 'Verbs',
        conjugation: {
            preterite: 'Chiɣ',
            intensive: 'Ttet',
            future: 'Ad cceɣ',
            aorist: 'Ccu'
        }
    },
    {
        id: 'v2',
        term_latin: 'Su',
        term_tifinagh: 'ⵙⵓ',
        definition: 'To Drink',
        category: 'Verbs',
        conjugation: {
            preterite: 'Swiɣ',
            intensive: 'Sess',
            future: 'Ad sweɣ',
            aorist: 'Su'
        }
    },
    {
        id: 'v3',
        term_latin: 'Gen',
        term_tifinagh: 'ⴳⵏ',
        definition: 'To Sleep',
        category: 'Verbs',
        conjugation: {
            preterite: 'Gneɣ',
            intensive: 'Ggan',
            future: 'Ad gneɣ',
            aorist: 'Gen'
        }
    },
    {
        id: 'v4',
        term_latin: 'Awi',
        term_tifinagh: 'ⴰⵡⵉ',
        definition: 'To Take',
        category: 'Verbs',
        conjugation: {
            preterite: 'Wwiɣ',
            intensive: 'Ttawi',
            future: 'Ad awiɣ',
            aorist: 'Awi'
        }
    },
    {
        id: 'v5',
        term_latin: 'Ini',
        term_tifinagh: 'ⵉⵏⵉ',
        definition: 'To Say',
        category: 'Verbs',
        conjugation: {
            preterite: 'Nniɣ',
            intensive: 'Ttini',
            future: 'Ad iniɣ',
            aorist: 'Ini'
        }
    },
    {
        id: 'v6',
        term_latin: 'Ddu',
        term_tifinagh: 'ⴷⴷⵓ',
        definition: 'To Go',
        category: 'Verbs',
        conjugation: {
            preterite: 'Ddiɣ',
            intensive: 'Teddu',
            future: 'Ad dduɣ',
            aorist: 'Ddu'
        }
    },

    // --- ADJECTIVES ---
    { id: 'adj2', term_latin: 'Imzi', term_tifinagh: 'ⵉⵎⵥⵉ', definition: 'Small', category: 'Adjectives' },
    { id: 'adj3', term_latin: 'Ifulki', term_tifinagh: 'ⵉⴼⵓⵍⴽⵉ', definition: 'Good / Beautiful', category: 'Adjectives' },
    { id: 'adj4', term_latin: 'Ixchn', term_tifinagh: 'ⵉⵅⵛⵏ', definition: 'Bad / Ugly', category: 'Adjectives' },
    { id: 'adj5', term_latin: 'Idrus', term_tifinagh: 'ⵉⴷⵔⵓⵙ', definition: 'Few / Little', category: 'Adjectives' },
    { id: 'adj6', term_latin: 'Iggut', term_tifinagh: 'ⵉⴳⴳⵓⵜ', definition: 'Many / Much', category: 'Adjectives' }
];

// Convert IRCAM verb data into DictionaryEntry format
const ircamEntries: DictionaryEntry[] = (ircamVerbData as IrcamVerb[]).map((verb, index) => {
    const latinForm = convertScript(verb.tifinagh, 'latin');
    return {
        id: `ircam_v_${index}`,
        term_latin: latinForm || verb.tifinagh,
        term_tifinagh: verb.tifinagh,
        term_arabic: convertScript(verb.tifinagh, 'arabic'),
        definition: verb.english,
        category: 'Verbs',
        source: 'IRCAM'
    };
}).filter(entry => entry.definition.length > 0);

// Auto-categorize an entry from its English definition.
// Declared as a function so it is hoisted above the imported-entry mapping.
function categorizeWord(definition: string): string {
    const d = definition.toLowerCase();
    if (/\b(color|colour)\b/.test(d)) return 'Colors';
    if (/\b(red|blue|green|yellow|white|black|brown|grey|gray|orange|pink|purple)\b/.test(d) && d.length < 30) return 'Colors';
    if (/\b(hand|foot|head|ear|eye|nose|mouth|lip|finger|belly|stomach|skin|hair|neck|throat|breast|tooth|nail|tongue|bone|heart|knee|back|leg|arm|shoulder)\b/.test(d) && !d.includes('to ')) return 'Body';
    if (/\b(rain|snow|wind|cloud|storm|lightning|thunder|ice|freeze|fog|sun|cold|hot|warm|breeze|weather)\b/.test(d) && !d.includes('to ')) return 'Weather';
    if (/\b(bear|bird|cat|dog|horse|fish|lion|tiger|falcon|eagle|snake|wolf|sheep|cow|goat|donkey|bee|ant|worm|dolphin|giraffe|nightingale|camel)\b/.test(d) && !d.includes('to ')) return 'Animals';
    if (/\b(bread|milk|meat|tea|water|apple|corn|salt|butter|olive|fig|soup|food|eat|drink|honey|fruit|egg|cheese|flour)\b/.test(d) && !d.includes('to ')) return 'Food';
    if (/\b(father|mother|brother|sister|son|daughter|child|husband|wife|man|woman|family|grandfather|grandmother|uncle|aunt|friend|person)\b/.test(d) && !d.includes('to ')) return 'Family';
    if (/\b(mountain|river|sea|ocean|lake|forest|tree|flower|rock|stone|sand|cliff|swamp|spring|root|earth|land|soil|well|valley|hill)\b/.test(d) && !d.includes('to ')) return 'Nature';
    if (/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|day|night|month|year|week|time|season)\b/.test(d)) return 'Time';
    if (/\b(house|road|wall|village|market|school|mosque|city|town|airport|village|portal|door|gate)\b/.test(d)) return 'Places';
    if (/\b(big|small|old|new|long|short|round|wide|wet|smooth|bad|honest|complex|national|left|right)\b/.test(d) && !d.includes('to ') && d.length < 50) return 'Adjectives';
    if (/\b(one|two|three|four|five|six|seven|eight|nine|ten|twenty|hundred|thousand|zero|number)\b/.test(d) && d.length < 30) return 'Numbers';
    // Bare numerals ("10", "24") — the PDF's numbers section stores them this way
    if (/^\d+(st|nd|rd|th)?$/.test(d.trim())) return 'Numbers';
    if (d.startsWith('to ')) return 'Verbs';
    if (/\b(garment|wool|cloth|cape|robe|dress|shoe|hat|cap)\b/.test(d)) return 'Clothing';
    if (/\b(king|flag|people|assembly|rope|smoke|fire|seed|silver|health|word)\b/.test(d)) return 'Culture';
    return 'General';
}

// Convert Wiktionary data into DictionaryEntry format
// Source: Wiktionary (CC-BY-SA 4.0 / GFDL)
const wiktionaryEntries: DictionaryEntry[] = (wiktionaryData as WiktionaryWord[])
    .filter(w => w.definition && w.definition.length > 1 && w.tifinagh && w.tifinagh.length > 1)
    .map((word, index) => {
        // Clean definition: remove leading commas, trim
        let def = word.definition.replace(/^[,;\s]+/, '').trim();
        // Capitalize first letter
        def = def.charAt(0).toUpperCase() + def.slice(1);

        const latinForm = convertScript(word.tifinagh, 'latin');
        return {
            id: `wikt_${index}`,
            term_latin: latinForm || word.tifinagh,
            term_tifinagh: word.tifinagh,
            term_arabic: convertScript(word.tifinagh, 'arabic'),
            definition: def,
            category: categorizeWord(word.definition),
            source: 'Wiktionary'
        };
    });

// The PDF import contains rows repeated across its two halves, so collapse
// entries that share both a term and a definition before merging sources.
const seenImported = new Set<string>();
const uniqueImportedEntries = importedEntries.filter(e => {
    const key = `${e.term_tifinagh}|${e.definition.toLowerCase()}`;
    if (seenImported.has(key)) return false;
    seenImported.add(key);
    return true;
});

// Deduplicate: prefer manual > imported > IRCAM > Wiktionary
const existingTifinagh = new Set([
    ...manualEntries.map(e => e.term_tifinagh),
    ...uniqueImportedEntries.map(e => e.term_tifinagh)
]);

const uniqueIrcamEntries = ircamEntries.filter(e => !existingTifinagh.has(e.term_tifinagh));

// Also deduplicate Wiktionary against all previous sources
const allExistingTifinagh = new Set([
    ...existingTifinagh,
    ...uniqueIrcamEntries.map(e => e.term_tifinagh)
]);

const uniqueWiktionaryEntries = wiktionaryEntries.filter(e => !allExistingTifinagh.has(e.term_tifinagh));

export const fullDictionaryData: DictionaryEntry[] = [
    ...manualEntries,
    ...uniqueImportedEntries,
    ...uniqueIrcamEntries,
    ...uniqueWiktionaryEntries
];

export const dictionaryData = fullDictionaryData;

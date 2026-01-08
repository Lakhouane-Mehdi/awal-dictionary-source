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
    conjugation?: {
        preterite: string;
        intensive: string;
        future: string;
        aorist?: string;
    };
}

export const fullDictionaryData: DictionaryEntry[] = [
    // --- GREETINGS ---
    { id: 'g1', term_latin: 'Azul', term_tifinagh: 'ⴰⵣⵓⵍ', term_arabic: 'أزول', definition: 'Hello / Welcome', category: 'Greetings' },
    { id: 'g2', term_latin: 'Tanmirt', term_tifinagh: 'ⵜⴰⵏⵎⵉⵔⵜ', term_arabic: 'تنميرت', definition: 'Thank you', category: 'Greetings' },
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
    { id: 'f6', term_latin: 'Tamghart', term_tifinagh: 'ⵜⴰⵎⵖⴰⵔⵜ', definition: 'Woman / Wife', category: 'Family' },
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
    { id: 'adj1', term_latin: 'Imghur', term_tifinagh: 'ⵉⵎⵖⵓⵔ', definition: 'Big / Large', category: 'Adjectives' },
    { id: 'adj2', term_latin: 'Imzi', term_tifinagh: 'ⵉⵎⵥⵉ', definition: 'Small', category: 'Adjectives' },
    { id: 'adj3', term_latin: 'Ifulki', term_tifinagh: 'ⵉⴼⵓⵍⴽⵉ', definition: 'Good / Beautiful', category: 'Adjectives' },
    { id: 'adj4', term_latin: 'Ixchn', term_tifinagh: 'ⵉⵅⵛⵏ', definition: 'Bad / Ugly', category: 'Adjectives' },
    { id: 'adj5', term_latin: 'Idrus', term_tifinagh: 'ⵉⴷⵔⵓⵙ', definition: 'Few / Little', category: 'Adjectives' },
    { id: 'adj6', term_latin: 'Iggut', term_tifinagh: 'ⵉⴳⴳⵓⵜ', definition: 'Many / Much', category: 'Adjectives' }
];

export const dictionaryData = fullDictionaryData;


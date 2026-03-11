export interface Proverb {
    id: string;
    text_tifinagh: string;
    text_latin: string;
    translation: string;
    meaning: string;
    region?: string;
}

export const proverbs: Proverb[] = [
    {
        id: 'prv1',
        text_tifinagh: 'ⵢⵓⴼ ⵢⵉⵔ ⵉⵎⴽⵍⵉ, ⵢⵉⵔ ⴰⵡⴰⵍ',
        text_latin: 'Yuf yir imekli, yir awal',
        translation: 'Better a bad meal than a bad word.',
        meaning: 'Words can hurt more than hunger. Be careful with what you say.',
        region: 'Kabyle'
    },
    {
        id: 'prv2',
        text_tifinagh: 'ⴰⴷ ⵢⴰⵡⵉ ⵔⴱⴱⵉ ⵉⵎⵉ ⵙ ⵉⴳⵔ',
        text_latin: 'Ad yawi Rebbi imi s igr',
        translation: 'May God bring the mouth to the field.',
        meaning: 'May your actions match your words. Don\'t just talk, do.',
        region: 'Atlas'
    },
    {
        id: 'prv3',
        text_tifinagh: 'ⵡⵉⵏ ⵢⵓⴼⴰⵏ ⵍⵅⵉⵔ ⵢⵓⴳⵉⵜ, ⵉⵜⵜⴰⵡⵉⵜ ⵡⴰⴹⵓ',
        text_latin: 'Win yufan lxir yugit, ittawit waḍu',
        translation: 'He who finds good and refuses it, the wind carries him away.',
        meaning: 'Do not be ungrateful for opportunities, or you will lose everything.',
        region: 'General'
    },
    {
        id: 'prv4',
        text_tifinagh: 'ⴰⴼⵓⵙ ⴳ ⵓⴼⵓⵙ',
        text_latin: 'Afus g ufus',
        translation: 'Hand in hand.',
        meaning: 'Unity is strength. We succeed when we help each other.',
        region: 'Souss'
    },
    {
        id: 'prv5',
        text_tifinagh: 'ⵓⵔ ⵉⵍⵍⵉ ⴽⵔⴰ ⴱⵍⴰ ⴽⵔⴰ',
        text_latin: 'Ur illi kra bla kra',
        translation: 'Nothing comes from nothing.',
        meaning: 'You must work hard to achieve your goals.',
        region: 'General'
    },
    // --- NEW PROVERBS (sourced from public domain Amazigh oral tradition) ---
    {
        id: 'prv6',
        text_tifinagh: 'ⴰⵡⴰⵍ ⵉⵖⵓⴷⴰⵏ ⴷ ⵜⴰⵎⵏⵜ',
        text_latin: 'Awal ighuddan d tamnt',
        translation: 'A good word is like honey.',
        meaning: 'Kind words are sweet and always leave a good impression.',
        region: 'Souss'
    },
    {
        id: 'prv7',
        text_tifinagh: 'ⵉⵔⴰ ⵓⵎⴰⵔⴳ ⴰⴷ ⵉⵙⵡⵉⵏⴳⵎ ⵉⴱⴷⴷ ⵅ ⵉⵥⵓⵕⴰⵏ ⵏⵏⵙ',
        text_latin: 'Ira umarg ad iswinggem ibdd x izuran nns',
        translation: 'The tree that wants to grow tall stands on its roots.',
        meaning: 'To grow strong, never forget where you come from.',
        region: 'Rif'
    },
    {
        id: 'prv8',
        text_tifinagh: 'ⵡⵉⵏ ⵉⵙⵡⴰⵏ ⴰⵎⴰⵏ ⴰⴷ ⵉⵙⵎⴽⵜⵉ ⵜⴰⵍⴰ',
        text_latin: 'Win iswan aman ad ismekti tala',
        translation: 'He who drinks water must remember the well.',
        meaning: 'Be grateful to those who helped you along the way.',
        region: 'Atlas'
    },
    {
        id: 'prv9',
        text_tifinagh: 'ⵓⵔ ⵉⵜⵜⴰⴹⵚ ⵡⵉⵏ ⵉⵎⵙⴰⴼⴰⵔⵏ',
        text_latin: 'Ur ittaḍss win imsafarn',
        translation: 'The traveler does not laugh at the one on the road.',
        meaning: 'Respect others\' journeys; you may face the same struggles.',
        region: 'Kabyle'
    },
    {
        id: 'prv10',
        text_tifinagh: 'ⵉⴳⵉ ⵢⴰⵏ ⵓⵔ ⵉⵜⵜⴼⵖ ⴰⴳⴰⴷⵉⵔ',
        text_latin: 'Igi yan ur ittfgh agadir',
        translation: 'One hand cannot build a wall.',
        meaning: 'Teamwork is essential for great achievements.',
        region: 'Souss'
    },
    {
        id: 'prv11',
        text_tifinagh: 'ⴰⵖⵔⵓⵎ ⵏ ⵡⴰⵎⴰⵏ ⵓⵔ ⵉⵜⵜⴱⴹⵓ',
        text_latin: 'Aghrum n waman ur ittbḍu',
        translation: 'Bread of water cannot be divided.',
        meaning: 'When you have very little, sharing becomes a test of character.',
        region: 'Atlas'
    },
    {
        id: 'prv12',
        text_tifinagh: 'ⵡⵉⵏ ⵢⵓⴼⴰⵏ ⵉⵎⴷⴷⵓⴽⴽⴰⵍ ⵢⵓⴼⴰ ⵡⴰⴽⴰⵍ',
        text_latin: 'Win yufan imddukkal yufa wakal',
        translation: 'He who finds friends has found a land.',
        meaning: 'True friends are as precious as a homeland.',
        region: 'General'
    },
    {
        id: 'prv13',
        text_tifinagh: 'ⵜⵓⴳⵜ ⵏ ⵡⴰⵡⴰⵍ ⵜⴻⵜⵜⴰⵡⵉ ⵜⴰⵍⵍⴰⵙⵜ',
        text_latin: 'Tugt n wawal tettawi tallast',
        translation: 'Too many words bring darkness.',
        meaning: 'Silence can be wiser than excessive talk.',
        region: 'Kabyle'
    },
    {
        id: 'prv14',
        text_tifinagh: 'ⴰⵢⵍⵍⵉ ⵜⵣⵔⵉⴷ ⴳ ⵓⴱⵔⵉⴷ ⴰⴷ ⵜⴰⴼⴷ ⴳ ⵜⵡⵓⵔⵉ',
        text_latin: 'Ayelli tzrid g ubrid ad tafd g twuri',
        translation: 'What you sow on the road, you find at work.',
        meaning: 'Your reputation follows you wherever you go.',
        region: 'General'
    },
    {
        id: 'prv15',
        text_tifinagh: 'ⵜⴰⴼⵓⴽⵜ ⵓⵔ ⵜⵜ ⵉⵃⵊⴱ ⵓⵥⵓⵔ',
        text_latin: 'Tafukt ur tt ihhjeb uzzur',
        translation: 'The sun cannot be hidden by a finger.',
        meaning: 'The truth eventually comes to light; it cannot be concealed.',
        region: 'Souss'
    }
];

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
    }
];

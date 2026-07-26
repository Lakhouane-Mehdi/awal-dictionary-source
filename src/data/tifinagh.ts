// The Neo-Tifinagh alphabet as standardised by IRCAM.
// Shared by the Learn carousel and the /alphabet reference page.

export interface TifinaghLetter {
    char: string;
    name: string;
    latin: string;
    example: string;
    exampleMeaning: string;
}

export const tifinaghAlphabet: TifinaghLetter[] = [
    { char: 'ⴰ', name: 'Ya', latin: 'A', example: 'Aman', exampleMeaning: 'Water' },
    { char: 'ⴱ', name: 'Yab', latin: 'B', example: 'Baba', exampleMeaning: 'Father' },
    { char: 'ⴳ', name: 'Yag', latin: 'G', example: 'Gma', exampleMeaning: 'Brother' },
    { char: 'ⴷ', name: 'Yad', latin: 'D', example: 'Ddu', exampleMeaning: 'To go' },
    { char: 'ⴹ', name: 'Yaḍ', latin: 'Ḍ', example: 'Iṭḍen', exampleMeaning: 'Others' },
    { char: 'ⴻ', name: 'Yey', latin: 'E', example: 'Iles', exampleMeaning: 'Tongue' },
    { char: 'ⴼ', name: 'Yaf', latin: 'F', example: 'Afus', exampleMeaning: 'Hand' },
    { char: 'ⴽ', name: 'Yak', latin: 'K', example: 'Krad', exampleMeaning: 'Three' },
    { char: 'ⵀ', name: 'Yah', latin: 'H', example: 'Hiyya', exampleMeaning: 'Come on' },
    { char: 'ⵃ', name: 'Yaḥ', latin: 'Ḥ', example: 'Aḥwac', exampleMeaning: 'Group dance' },
    { char: 'ⵄ', name: 'Yaɛ', latin: 'Ɛ', example: 'Ɛad', exampleMeaning: 'Still / yet' },
    { char: 'ⵅ', name: 'Yax', latin: 'X', example: 'Xater', exampleMeaning: 'Important' },
    { char: 'ⵇ', name: 'Yaq', latin: 'Q', example: 'Qim', exampleMeaning: 'To sit' },
    { char: 'ⵉ', name: 'Yi', latin: 'I', example: 'Imi', exampleMeaning: 'Mouth' },
    { char: 'ⵊ', name: 'Yaj', latin: 'J', example: 'Jer', exampleMeaning: 'Between' },
    { char: 'ⵍ', name: 'Yal', latin: 'L', example: 'Laz', exampleMeaning: 'Hunger' },
    { char: 'ⵎ', name: 'Yam', latin: 'M', example: 'Mraw', exampleMeaning: 'Ten' },
    { char: 'ⵏ', name: 'Yan', latin: 'N', example: 'Nekk', exampleMeaning: 'I / me' },
    { char: 'ⵓ', name: 'Yu', latin: 'U', example: 'Ul', exampleMeaning: 'Heart' },
    { char: 'ⵔ', name: 'Yar', latin: 'R', example: 'Argaz', exampleMeaning: 'Man' },
    { char: 'ⵕ', name: 'Yaṛ', latin: 'Ṛ', example: 'Aẓṛu', exampleMeaning: 'Stone' },
    { char: 'ⵖ', name: 'Yaɣ', latin: 'Ɣ', example: 'Aɣyul', exampleMeaning: 'Donkey' },
    { char: 'ⵙ', name: 'Yas', latin: 'S', example: 'Sin', exampleMeaning: 'Two' },
    { char: 'ⵚ', name: 'Yaṣ', latin: 'Ṣ', example: 'Ṣbaḥ', exampleMeaning: 'Morning' },
    { char: 'ⵛ', name: 'Yac', latin: 'C (sh)', example: 'Ech', exampleMeaning: 'To eat' },
    { char: 'ⵜ', name: 'Yat', latin: 'T', example: 'Tamghart', exampleMeaning: 'Woman' },
    { char: 'ⵟ', name: 'Yaṭ', latin: 'Ṭ', example: 'Iṭri', exampleMeaning: 'Star' },
    { char: 'ⵡ', name: 'Yaw', latin: 'W', example: 'Wal', exampleMeaning: 'To look' },
    { char: 'ⵢ', name: 'Yay', latin: 'Y', example: 'Yir', exampleMeaning: 'Bad' },
    { char: 'ⵣ', name: 'Yaz', latin: 'Z', example: 'Azul', exampleMeaning: 'Hello' },
    { char: 'ⵥ', name: 'Yaẓ', latin: 'Ẓ', example: 'Anẓar', exampleMeaning: 'Rain' },
];

import { describe, it, expect } from 'vitest';
import { convertScript, detectScript, normalizeLatin, pdfLatinToIrcam, searchKey, toLatin } from '../utils/scriptConverter';

describe('detectScript', () => {
    it('recognises each script', () => {
        expect(detectScript('Azul')).toBe('latin');
        expect(detectScript('ⴰⵣⵓⵍ')).toBe('tifinagh');
        expect(detectScript('أزول')).toBe('arabic');
    });
});

describe('Latin -> Tifinagh', () => {
    it('converts simple words, ignoring case', () => {
        expect(convertScript('Azul', 'tifinagh')).toBe('ⴰⵣⵓⵍ');
        expect(convertScript('aZuL', 'tifinagh')).toBe('ⴰⵣⵓⵍ');
        expect(convertScript('Tanmirt', 'tifinagh')).toBe('ⵜⴰⵏⵎⵉⵔⵜ');
    });

    it('handles digraphs and IRCAM letters the same way', () => {
        expect(convertScript('Tamghart', 'tifinagh')).toBe('ⵜⴰⵎⵖⴰⵔⵜ');
        expect(convertScript('tamɣart', 'tifinagh')).toBe('ⵜⴰⵎⵖⴰⵔⵜ');
        expect(convertScript('ṣbaḥ lxir', 'tifinagh')).toBe('ⵚⴱⴰⵃ ⵍⵅⵉⵔ');
    });

    it('leaves out the schwa and merges doubled vowels', () => {
        expect(convertScript('Nekk', 'tifinagh')).toBe('ⵏⴽⴽ');
        expect(convertScript('Yemma', 'tifinagh')).toBe('ⵢⵎⵎⴰ');
        expect(convertScript('Aatay', 'tifinagh')).toBe('ⴰⵜⴰⵢ');
    });

    it('reads the PDF transcription (ş ţ ď o p v) without leaking Latin letters', () => {
        const out = convertScript('şbaţ ďo pv', 'tifinagh');
        expect(out).toBe('ⵚⴱⴰⵟ ⴹⵓ ⴱⴼ');
        expect(out).not.toMatch(/[a-zşţď]/i);
    });

    it('reads chat-style numerals', () => {
        expect(convertScript('l7sab', 'tifinagh')).toBe('ⵍⵃⵙⴰⴱ');
        expect(convertScript('3lach', 'tifinagh')).toBe('ⵄⵍⴰⵛ');
    });
});

describe('Tifinagh -> Latin', () => {
    it('produces IRCAM Latin', () => {
        expect(convertScript('ⴰⵣⵓⵍ', 'latin')).toBe('azul');
        expect(convertScript('ⵜⴰⵎⵖⴰⵔⵜ', 'latin')).toBe('tamɣart');
        expect(convertScript('ⵚⴱⴰⵃ ⵍⵅⵉⵔ', 'latin')).toBe('ṣbaḥ lxir');
        expect(convertScript('ⴰⵙⴳⴳⵯⴰⵙ', 'latin')).toBe('asggʷas');
    });

    it('round-trips through Latin without loss', () => {
        for (const word of ['ⴰⵣⵓⵍ', 'ⵜⴰⵏⵎⵉⵔⵜ', 'ⵜⴰⵎⵖⴰⵔⵜ', 'ⵚⴱⴰⵃ ⵍⵅⵉⵔ', 'ⴰⵙⴳⴳⵯⴰⵙ', 'ⵉⵎⵥⵉ', 'ⴽⵕⴰⴹ']) {
            expect(convertScript(convertScript(word, 'latin'), 'tifinagh')).toBe(word);
        }
    });
});

describe('Latin <-> Arabic', () => {
    it('writes word-initial vowels with a hamza seat', () => {
        expect(convertScript('Azul', 'arabic')).toBe('أزول');
        expect(convertScript('Imi', 'arabic')).toBe('إمي');
    });

    it('writes doubled consonants with a shadda', () => {
        expect(convertScript('Iggut', 'arabic')).toBe('إگّوت');
    });

    it('reads Arabic back into Latin', () => {
        expect(convertScript('أزول', 'latin')).toBe('azul');
        expect(convertScript('تانميرت', 'latin')).toBe('tanmirt');
        expect(convertScript('أغيول', 'latin')).toBe('aɣyul');
    });

    it('converts between Arabic and Tifinagh through Latin', () => {
        expect(convertScript('أزول', 'tifinagh')).toBe('ⴰⵣⵓⵍ');
        expect(convertScript('ⴰⵣⵓⵍ', 'arabic')).toBe('أزول');
    });
});

describe('edge cases', () => {
    it('returns text unchanged when it is already in the target script', () => {
        expect(convertScript('Azul', 'latin')).toBe('Azul');
        expect(convertScript('ⴰⵣⵓⵍ', 'tifinagh')).toBe('ⴰⵣⵓⵍ');
        expect(convertScript('أزول', 'arabic')).toBe('أزول');
    });

    it('handles empty strings', () => {
        expect(convertScript('', 'tifinagh')).toBe('');
        expect(toLatin('')).toBe('');
    });

    it('keeps punctuation and spacing', () => {
        expect(convertScript('bochklit; lpikala', 'tifinagh')).toBe('ⴱⵓⵛⴽⵍⵉⵜ; ⵍⴱⵉⴽⴰⵍⴰ');
    });
});

describe('PDF capital H', () => {
    it('reads H as ḥ but leaves all-caps words alone', () => {
        expect(pdfLatinToIrcam('slHil')).toBe('slḥil');
        expect(pdfLatinToIrcam('Hasha')).toBe('ḥasha');
        expect(pdfLatinToIrcam('Rbbi; ALLAH')).toBe('Rbbi; ALLAH');
        expect(normalizeLatin(pdfLatinToIrcam('lHsab'))).toBe('lḥsab');
    });
});

describe('searchKey', () => {
    it('gives every spelling of a word the same key', () => {
        const forms = ['aɣyul', 'aghyul', 'Aghyul', 'ⴰⵖⵢⵓⵍ', 'أغيول'];
        expect(new Set(forms.map(searchKey)).size).toBe(1);
    });

    it('ignores emphatic dots, numerals and doubled letters', () => {
        expect(searchKey('lḥsab')).toBe(searchKey('l7sab'));
        expect(searchKey('Iggut')).toBe(searchKey('igut'));
        expect(searchKey('ṣbaḥ')).toBe(searchKey('sbah'));
    });
});

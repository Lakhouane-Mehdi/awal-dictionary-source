import { describe, it, expect } from 'vitest';
import { splitGrammarNotes } from '../utils/grammarNotes';

describe('splitGrammarNotes', () => {
    it('moves gender notes out of the term', () => {
        expect(splitGrammarNotes('Yan(masc.)/yat(fem.)')).toEqual({
            term: 'Yan/yat',
            notes: 'Masculine: Yan · Feminine: yat',
        });
    });

    it('names the word a conjugation note applies to', () => {
        expect(splitGrammarNotes('g (conj) muhim')).toEqual({ term: 'g muhim', notes: 'Conjugate: g' });
        expect(splitGrammarNotes('sxsr (conj. in present) lxatr')).toEqual({
            term: 'sxsr lxatr',
            notes: 'Conjugate in the present: sxsr',
        });
        expect(splitGrammarNotes('tsh (conj. as reflexive v)')).toEqual({ term: 'tsh', notes: 'Conjugated reflexively: tsh' });
        expect(splitGrammarNotes('ngh (relexive) laz').notes).toBe('Conjugated reflexively: ngh');
    });

    it('groups repeated notes and keeps separators tidy', () => {
        expect(splitGrammarNotes('izdar (n); tabut (n); abud (n)')).toEqual({
            term: 'izdar; tabut; abud',
            notes: 'Noun: izdar, tabut, abud',
        });
        expect(splitGrammarNotes('luHsh; luHush(plr)')).toEqual({ term: 'luHsh; luHush', notes: 'Plural: luHush' });
    });

    it('leaves Tamazight in parentheses alone', () => {
        expect(splitGrammarNotes('ar (d) yuškan')).toEqual({ term: 'ar (d) yuškan' });
        expect(splitGrammarNotes('tifiyyi (azar)')).toEqual({ term: 'tifiyyi (azar)' });
    });

    it('returns text without notes unchanged', () => {
        expect(splitGrammarNotes('argaz n utma')).toEqual({ term: 'argaz n utma' });
    });
});

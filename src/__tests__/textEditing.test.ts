import { describe, it, expect } from 'vitest';
import { insertText, deleteBackward } from '../utils/textEditing';

describe('insertText', () => {
    it('inserts at the caret', () => {
        expect(insertText('ⴰⵍ', 1, 1, 'ⵡⴰ')).toEqual({ value: 'ⴰⵡⴰⵍ', caret: 3 });
    });

    it('replaces a selection', () => {
        expect(insertText('argaz', 0, 5, 'ⴰ')).toEqual({ value: 'ⴰ', caret: 1 });
    });

    it('appends to an empty field', () => {
        expect(insertText('', 0, 0, 'ⵣ')).toEqual({ value: 'ⵣ', caret: 1 });
    });
});

describe('deleteBackward', () => {
    it('removes the letter before the caret', () => {
        expect(deleteBackward('ⴰⵡⴰⵍ', 2, 2)).toEqual({ value: 'ⴰⴰⵍ', caret: 1 });
    });

    it('removes a selection', () => {
        expect(deleteBackward('ⴰⵡⴰⵍ', 1, 3)).toEqual({ value: 'ⴰⵍ', caret: 1 });
    });

    it('does nothing at the start of the field', () => {
        expect(deleteBackward('ⴰⵍ', 0, 0)).toEqual({ value: 'ⴰⵍ', caret: 0 });
    });

    it('never splits a character made of two code units', () => {
        expect(deleteBackward('a😀', 3, 3)).toEqual({ value: 'a', caret: 1 });
    });
});

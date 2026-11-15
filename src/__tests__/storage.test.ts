// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readJSON, readString, writeJSON, writeString } from '../utils/storage';

const isNumberList = (v: unknown): v is number[] => Array.isArray(v) && v.every(n => typeof n === 'number');

describe('storage helpers', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it('round-trips strings and JSON', () => {
        writeString('k', 'v');
        expect(readString('k')).toBe('v');
        writeJSON('list', [1, 2]);
        expect(readJSON('list', [], isNumberList)).toEqual([1, 2]);
    });

    it('falls back when the value is missing, corrupted or the wrong shape', () => {
        expect(readJSON('missing', [9], isNumberList)).toEqual([9]);
        localStorage.setItem('bad', '{not json');
        expect(readJSON('bad', [9], isNumberList)).toEqual([9]);
        localStorage.setItem('wrong', '"text"');
        expect(readJSON('wrong', [9], isNumberList)).toEqual([9]);
    });

    it('survives storage that throws', () => {
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
        expect(readString('k')).toBeNull();
        expect(() => writeString('k', 'v')).not.toThrow();
        expect(readJSON('k', 'fallback', (v): v is string => typeof v === 'string')).toBe('fallback');
    });
});

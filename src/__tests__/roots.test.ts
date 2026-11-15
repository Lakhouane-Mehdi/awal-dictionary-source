import { describe, it, expect } from 'vitest';
import { findRootFamilies, formatRoot, rootKey, rootSlug } from '../data/roots';
import { dictionaryData } from '../data/dictionary';
import { getRootBySlug, getRootFamilyOf, rootFamilies } from '../data/taxonomy';

describe('rootKey', () => {
    it('strips noun patterns and keeps the consonants', () => {
        expect(rootKey('tamɣart', false)).toBe('mɣr');
        expect(rootKey('amɛdur', false)).toBe('mɛdr');
        expect(rootKey('timmiɛdrt', false)).toBe('mɛdr');
        expect(rootKey('argaz', false)).toBe('rgz');
    });

    it('drops the Arabic article and merges doubled consonants', () => {
        expect(rootKey('lmrḍ', false)).toBe('mrḍ');
        expect(rootKey('ṣṣbr', false)).toBe('ṣbr');
    });

    it('folds loose spellings', () => {
        expect(rootKey('tamghart', false)).toBe('mɣr');
    });

    it('does not strip noun affixes from verbs', () => {
        expect(rootKey('tlq', true)).toBe('tlq');
    });

    it('rejects phrases and skeletons that are not roots', () => {
        expect(rootKey('ait uxam', false)).toBeNull();
        expect(rootKey('a', false)).toBeNull();
    });
});

describe('root display and slugs', () => {
    it('writes digraph letters like the hand-written roots', () => {
        expect(formatRoot('mɣr')).toBe('M-Gh-R');
        expect(rootSlug('M-Gh-R')).toBe('m-gh-r');
    });

    it('keeps emphatic and pharyngeal letters in slugs', () => {
        expect(rootSlug(formatRoot('ḍɛf'))).toBe('d-ain-f');
    });
});

describe('findRootFamilies', () => {
    const word = (term_latin: string, definition: string, verb = false) =>
        ({ term_latin, definition, conjugation: verb ? {} : undefined });

    it('groups words whose meanings agree', () => {
        const entries = [word('mmiɛdr', 'to be crazy', true), word('amɛdur', 'crazy person'), word('timmiɛdrt', 'craziness')];
        const roots = findRootFamilies(entries);
        expect([...roots.values()]).toEqual(['M-Ɛ-D-R', 'M-Ɛ-D-R', 'M-Ɛ-D-R']);
    });

    it('drops skeletons shared by unrelated verbs', () => {
        const entries = [word('zl', 'to lose', true), word('azl', 'to run', true), word('izlan', 'songs')];
        expect(findRootFamilies(entries).size).toBe(0);
    });

    it('leaves out words whose meaning does not match', () => {
        const roots = findRootFamilies([word('kmz', 'to itch', true), word('akmaz', 'itch'), word('ikmzn', 'stars')]);
        expect(roots.size).toBe(2);
    });

    it('needs a verb to anchor the family', () => {
        expect(findRootFamilies([word('argaz', 'man'), word('irgazn', 'men')]).size).toBe(0);
    });
});

describe('dictionary root families', () => {
    it('keeps the hand-written M-Gh-R family at its URL', () => {
        expect(getRootBySlug('m-gh-r')?.entries.map(e => e.term_latin)).toEqual(expect.arrayContaining(['Tamghart', 'Imghur']));
    });

    it('gives every family a unique URL', () => {
        const slugs = rootFamilies.map(f => f.slug);
        expect(new Set(slugs).size).toBe(slugs.length);
    });

    it('finds families across the dictionary', () => {
        expect(rootFamilies.length).toBeGreaterThan(50);
    });

    it('only shows a root link for words that have relatives', () => {
        const azul = dictionaryData.find(e => e.term_latin === 'Azul' && e.root);
        expect(azul && getRootFamilyOf(azul)).toBeUndefined();
    });
});

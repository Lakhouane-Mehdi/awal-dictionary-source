import type { DictionaryEntry } from '../data/dictionary';
import { convertScript, type Script } from './scriptConverter';

/**
 * The headword of an entry in the reader's chosen script. Uses the stored
 * spelling (hand-written for curated entries, converted with the source's
 * own rules for imports) instead of re-converting term_latin on the fly.
 */
export const displayTerm = (entry: DictionaryEntry, script: Script): string => {
    if (script === 'tifinagh') return entry.term_tifinagh || convertScript(entry.term_latin, 'tifinagh');
    if (script === 'arabic') return entry.term_arabic || convertScript(entry.term_latin, 'arabic');
    return entry.term_latin;
};

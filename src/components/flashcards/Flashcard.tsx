import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Volume2 } from 'lucide-react';
import type { ReactNode } from 'react';
import type { DictionaryEntry } from '../../data/dictionary';
import { useScript } from '../../context/ScriptContext';
import { useTTS } from '../../hooks/useTTS';
import { displayTerm } from '../../utils/displayTerm';

interface FlashcardProps {
    entry: DictionaryEntry;
    revealed: boolean;
    onReveal: () => void;
    /** Shown under the meaning once it is revealed (rating buttons, etc.) */
    children?: ReactNode;
}

/** One card: the word on the front, its meaning once revealed. */
export const Flashcard = ({ entry, revealed, onReveal, children }: FlashcardProps) => {
    const { script } = useScript();
    const { speak, speaking } = useTTS();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="glass-panel p-8 sm:p-10 flex flex-col items-center justify-center min-h-[340px] text-center mb-5"
            >
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] px-3 py-1 rounded bg-indigo-50 dark:bg-white/10 text-indigo-600 dark:text-indigo-200 mb-8">
                    {entry.category || 'General'}
                </span>

                <p className={`font-display text-4xl sm:text-5xl font-bold text-indigo-800 dark:text-sand-100 mb-2 leading-tight break-words max-w-full ${script === 'tifinagh' ? 'tifinagh-text' : ''}`}>
                    {displayTerm(entry, script)}
                </p>
                <p className="tifinagh-text text-xl text-accent-600 dark:text-accent-300 mb-8 break-words max-w-full">
                    {script !== 'tifinagh' ? entry.term_tifinagh : entry.term_latin}
                </p>

                {!revealed ? (
                    <button
                        type="button"
                        onClick={onReveal}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-indigo-700/15 dark:border-white/15 text-indigo-600 dark:text-indigo-200 font-semibold hover:border-accent-400 hover:text-accent-600 transition active:scale-95"
                    >
                        <Eye size={17} aria-hidden="true" /> Reveal Meaning
                        <kbd className="hidden sm:inline text-[10px] font-semibold px-1.5 py-0.5 rounded border border-indigo-700/15 dark:border-white/15 text-indigo-400">Space</kbd>
                    </button>
                ) : (
                    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="w-full">
                        <div className="border-t border-indigo-700/10 dark:border-white/10 pt-6">
                            <p className="text-xl font-semibold text-indigo-800 dark:text-sand-100 mb-4 break-words" aria-live="polite">
                                {entry.definition}
                            </p>
                            <button
                                type="button"
                                onClick={() => speak(entry.term_latin)}
                                className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${speaking ? 'text-accent-600 dark:text-accent-300' : 'text-indigo-500 dark:text-indigo-300 hover:text-accent-600'}`}
                            >
                                <Volume2 size={16} aria-hidden="true" className={speaking ? 'animate-pulse' : ''} />
                                {speaking ? 'Playing' : 'Listen'}
                            </button>
                            {children}
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

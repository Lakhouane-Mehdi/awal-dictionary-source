import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Shuffle, Volume2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { usePageMeta } from '../hooks/usePageMeta';
import { useGamification } from '../hooks/useGamification';
import { useScript } from '../context/ScriptContext';
import { useTTS } from '../hooks/useTTS';
import { convertScript } from '../utils/scriptConverter';
import { dictionaryData } from '../data/dictionary';

// Cards need a real definition and a Tifinagh form to be worth reviewing.
const vocabPool = dictionaryData.filter(
    e => e.definition && e.definition.length > 2 && e.term_tifinagh && e.term_tifinagh.length > 0
);

const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const Vocabulary = () => {
    const { trackAction, completeDailyTask } = useGamification();
    const { script } = useScript();
    const { speak, speaking } = useTTS();

    const [entry, setEntry] = useState(() => pickRandom(vocabPool));
    const [revealed, setRevealed] = useState(false);
    const [reviewed, setReviewed] = useState(0);

    usePageMeta(
        'Vocabulary flashcards',
        `Practise Tamazight vocabulary with flashcards drawn from ${vocabPool.length.toLocaleString()} dictionary entries.`,
        '/learn/vocabulary'
    );

    const handleNext = () => {
        setEntry(pickRandom(vocabPool));
        setRevealed(false);
        const next = reviewed + 1;
        setReviewed(next);
        trackAction('VIEW');
        if (next % 5 === 0) completeDailyTask();
    };

    return (
        <div className="animate-in fade-in duration-300 max-w-2xl mx-auto">
            <PageHeader
                title="Vocabulary flashcards"
                meta={`${reviewed} reviewed this session`}
                description="Read the word, recall its meaning, then reveal to check yourself."
                crumbs={[{ label: 'Home', to: '/' }, { label: 'Learn', to: '/learn' }, { label: 'Vocabulary' }]}
            />

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

                    <p className={`font-display text-4xl sm:text-5xl font-bold text-indigo-800 dark:text-sand-100 mb-2 leading-tight ${script === 'tifinagh' ? 'tifinagh-text' : ''}`}>
                        {convertScript(entry.term_latin, script)}
                    </p>
                    <p className="tifinagh-text text-xl text-saffron-500 mb-8">
                        {script !== 'tifinagh' ? entry.term_tifinagh : entry.term_latin}
                    </p>

                    {!revealed ? (
                        <button
                            type="button"
                            onClick={() => setRevealed(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-indigo-700/15 dark:border-white/15 text-indigo-600 dark:text-indigo-200 font-semibold hover:border-saffron-400 hover:text-saffron-600 transition-all active:scale-95"
                        >
                            <Eye size={17} /> Reveal definition
                        </button>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full"
                        >
                            <div className="border-t border-indigo-700/10 dark:border-white/10 pt-6">
                                <p className="text-xl font-semibold text-indigo-800 dark:text-sand-100 mb-4">
                                    {entry.definition}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => speak(entry.term_latin)}
                                    className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${speaking ? 'text-saffron-600 dark:text-saffron-300' : 'text-indigo-500 dark:text-indigo-300 hover:text-saffron-600'}`}
                                >
                                    <Volume2 size={16} className={speaking ? 'animate-pulse' : ''} />
                                    {speaking ? 'Playing' : 'Listen'}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>

            <button
                type="button"
                onClick={handleNext}
                className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-panel transition-all active:scale-[0.99]"
            >
                <Shuffle size={18} /> Next word
            </button>
        </div>
    );
};

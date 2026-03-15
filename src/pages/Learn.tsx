import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TraceModal } from '../components/TraceModal';
import { Sparkles, Trophy, Shuffle, Eye, EyeOff, BookOpen } from 'lucide-react';
import { useGamification } from '../hooks/useGamification';
import { dictionaryData } from '../data/dictionary';
import { useScript } from '../context/ScriptContext';
import { convertScript } from '../utils/scriptConverter';

const alphabet = [
    { char: 'ⴰ', name: 'A', example: 'Aman' },
    { char: 'ⴱ', name: 'B', example: 'Baba' },
    { char: 'ⴳ', name: 'G', example: 'Gma' },
    { char: 'ⴷ', name: 'D', example: 'Ddu' },
    { char: 'ⴹ', name: 'Ḍ', example: 'Itḍen' },
    { char: 'ⴻ', name: 'E', example: 'Iles' },
    { char: 'ⴼ', name: 'F', example: 'Afus' },
    { char: 'ⴽ', name: 'K', example: 'Krad' },
    { char: 'ⵀ', name: 'H', example: 'Hiyya' },
    { char: 'ⵃ', name: 'Ḥ', example: 'Aḥwac' },
    { char: 'ⵄ', name: 'Ɛ', example: 'Ɛad' },
    { char: 'ⵅ', name: 'X', example: 'Xater' },
    { char: 'ⵇ', name: 'Q', example: 'Qim' },
    { char: 'ⵉ', name: 'I', example: 'Imi' },
    { char: 'ⵊ', name: 'J', example: 'Jer' },
    { char: 'ⵍ', name: 'L', example: 'Laz' },
    { char: 'ⵎ', name: 'M', example: 'Mraw' },
    { char: 'ⵏ', name: 'N', example: 'Nekk' },
    { char: 'ⵓ', name: 'U', example: 'Ul' },
    { char: 'ⵔ', name: 'R', example: 'Argaz' },
    { char: 'ⵕ', name: 'Ṛ', example: 'Aẓṛu' },
    { char: 'ⵖ', name: 'Ɣ', example: 'Aɣyul' },
    { char: 'ⵙ', name: 'S', example: 'Sin' },
    { char: 'ⵚ', name: 'Ṣ', example: 'Ṣbaḥ' },
    { char: 'ⵛ', name: 'C', example: 'Ech' },
    { char: 'ⵜ', name: 'T', example: 'Tamgḥart' },
    { char: 'ⵟ', name: 'Ṭ', example: 'Iṭri' },
    { char: 'ⵡ', name: 'W', example: 'Wal' },
    { char: 'ⵢ', name: 'Y', example: 'Yir' },
    { char: 'ⵣ', name: 'Z', example: 'Azul' },
    { char: 'ⵥ', name: 'Ẓ', example: 'Anẓar' },
];

// Vocab cards: words that have clean definitions and a category
const vocabPool = dictionaryData.filter(e =>
    e.definition && e.definition.length > 2 && e.term_tifinagh && e.term_tifinagh.length > 0
);

function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

type Mode = 'alphabet' | 'vocab';

export const Learn = () => {
    const { stats, trackAction, completeDailyTask } = useGamification();
    const { script } = useScript();

    const [mode, setMode] = useState<Mode>('alphabet');

    // Alphabet mode state
    const [currentIndex, setCurrentIndex] = useState(0);
    const [traceChar, setTraceChar] = useState<string | null>(null);

    // Vocab flashcard state
    const [vocabEntry, setVocabEntry] = useState(() => pickRandom(vocabPool));
    const [revealed, setRevealed] = useState(false);
    const [vocabCount, setVocabCount] = useState(0);

    const currentChar = alphabet[currentIndex];

    const nextChar = () => setCurrentIndex(prev => (prev + 1) % alphabet.length);
    const prevChar = () => setCurrentIndex(prev => (prev - 1 + alphabet.length) % alphabet.length);
    const handleRandom = () => setCurrentIndex(Math.floor(Math.random() * alphabet.length));

    const handleTraceComplete = () => {
        setTraceChar(null);
        trackAction('VIEW');
        completeDailyTask();
    };

    const handleNextVocab = () => {
        setVocabEntry(pickRandom(vocabPool));
        setRevealed(false);
        const next = vocabCount + 1;
        setVocabCount(next);
        trackAction('VIEW');
        if (next % 5 === 0) completeDailyTask();
    };

    return (
        <div className="w-full h-full pb-20 pt-4">
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                        Learning Dojo
                    </h1>
                    <p className="text-sm font-medium text-slate-500">Master Tamazight</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full font-bold text-sm">
                    <Trophy size={16} />
                    <span>{stats.wordsLearned} XP</span>
                </div>
            </header>

            {/* Mode Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
                <button
                    type="button"
                    onClick={() => setMode('alphabet')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'alphabet' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}
                >
                    <Sparkles size={15} /> Alphabet
                </button>
                <button
                    type="button"
                    onClick={() => setMode('vocab')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'vocab' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}
                >
                    <BookOpen size={15} /> Vocabulary
                </button>
            </div>

            <AnimatePresence mode="wait">
                {mode === 'alphabet' ? (
                    <motion.div key="alphabet" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                        <div className="relative mb-8">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="glass-panel p-8 flex flex-col items-center justify-center min-h-[300px] border-emerald-500/20 shadow-emerald-500/5 shadow-2xl"
                                >
                                    <span className="text-[120px] font-bold text-slate-800 dark:text-slate-100 leading-none tifinagh-text drop-shadow-sm mb-4">
                                        {currentChar.char}
                                    </span>
                                    <div className="flex flex-col items-center gap-1">
                                        <h2 className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{currentChar.name}</h2>
                                        <p className="text-slate-400 dark:text-slate-500 font-medium italic">"{currentChar.example}"</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setTraceChar(currentChar.char)}
                                        className="mt-8 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                                    >
                                        <Sparkles size={20} /> PRACTICE TRACING
                                    </button>
                                </motion.div>
                            </AnimatePresence>

                            <div className="flex justify-between mt-6 px-4">
                                <button type="button" onClick={prevChar} className="p-4 rounded-full glass-panel hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">← Prev</button>
                                <button type="button" onClick={handleRandom} className="p-4 rounded-full glass-panel hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-blue-500" title="Random character" aria-label="Random character">
                                    <Shuffle size={24} />
                                </button>
                                <button type="button" onClick={nextChar} className="p-4 rounded-full glass-panel hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Next →</button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="vocab" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={vocabEntry.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -16 }}
                                className="glass-panel p-8 flex flex-col items-center justify-center min-h-[300px] text-center mb-6"
                            >
                                {/* Category badge */}
                                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-6">
                                    {vocabEntry.category || 'General'}
                                </span>

                                {/* Word display */}
                                <p className={`text-5xl font-black text-slate-800 dark:text-slate-100 mb-2 leading-tight ${script === 'tifinagh' ? 'tifinagh-text' : ''}`}>
                                    {convertScript(vocabEntry.term_latin, script)}
                                </p>
                                <p className="text-xl text-slate-400 dark:text-slate-500 font-medium tifinagh-text mb-8">
                                    {script !== 'tifinagh' ? vocabEntry.term_tifinagh : vocabEntry.term_latin}
                                </p>

                                {/* Reveal */}
                                {!revealed ? (
                                    <button
                                        type="button"
                                        onClick={() => setRevealed(true)}
                                        className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                                    >
                                        <Eye size={18} /> Reveal Definition
                                    </button>
                                ) : (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full">
                                        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-6 py-4 mb-4">
                                            <p className="text-xl font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-2">
                                                <EyeOff size={18} /> {vocabEntry.definition}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={handleNextVocab}
                                className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                <Shuffle size={20} /> Next Word
                            </button>
                        </div>

                        <p className="text-center text-xs text-slate-400 mt-3">{vocabCount} words reviewed this session</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <TraceModal
                isOpen={!!traceChar}
                onClose={() => handleTraceComplete()}
                character={traceChar || ''}
            />
        </div>
    );
};

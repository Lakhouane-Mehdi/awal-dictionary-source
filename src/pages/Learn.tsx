import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TraceModal } from '../components/TraceModal';
import { Sparkles, Trophy, Shuffle } from 'lucide-react';

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

export const Learn = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [traceChar, setTraceChar] = useState<string | null>(null);
    const [score, setScore] = useState(0);

    const currentChar = alphabet[currentIndex];

    const nextChar = () => {
        setCurrentIndex((prev) => (prev + 1) % alphabet.length);
    };

    const prevChar = () => {
        setCurrentIndex((prev) => (prev - 1 + alphabet.length) % alphabet.length);
    };

    const handleRandom = () => {
        const idx = Math.floor(Math.random() * alphabet.length);
        setCurrentIndex(idx);
    };

    const handleTraceComplete = () => {
        // Ideally TraceModal would report completion. 
        // For now, we simulate success when they close it after trying
        setTraceChar(null);
        setScore(s => s + 5);
    };

    return (
        <div className=" w-full h-full pb-20 pt-4">
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent transform">
                        Learning Dojo
                    </h1>
                    <p className="text-sm font-medium text-slate-500">Master the Tifinagh Script</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full font-bold text-sm">
                    <Trophy size={16} />
                    <span>{score} XP</span>
                </div>
            </header>

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
                            onClick={() => setTraceChar(currentChar.char)}
                            className="mt-8 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <Sparkles size={20} />
                            PRACTICE TRACING
                        </button>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between mt-6 px-4">
                    <button onClick={prevChar} className="p-4 rounded-full glass-panel hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        ← Prev
                    </button>

                    <button onClick={handleRandom} className="p-4 rounded-full glass-panel hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-blue-500">
                        <Shuffle size={24} />
                    </button>

                    <button onClick={nextChar} className="p-4 rounded-full glass-panel hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        Next →
                    </button>
                </div>
            </div>

            <TraceModal
                isOpen={!!traceChar}
                onClose={() => handleTraceComplete()}
                character={traceChar || ''}
            />
        </div>
    );
};

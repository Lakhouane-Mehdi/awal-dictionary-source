import { useState } from 'react';
import { Shuffle } from 'lucide-react';
import { dictionaryData } from '../../data/dictionary';
import { useGamification } from '../../context/GamificationContext';
import { useCardKeys } from '../../hooks/useCardKeys';
import { Flashcard } from './Flashcard';

// Cards need a real definition and a Tifinagh form to be worth practising
const practicePool = dictionaryData.filter(
    e => e.definition && e.definition.length > 2 && e.term_tifinagh && e.term_tifinagh.length > 0
);

const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/** Random words from the whole dictionary, with no schedule */
export const PracticeSession = () => {
    const { trackAction, completeDailyTask } = useGamification();
    const [entry, setEntry] = useState(() => pickRandom(practicePool));
    const [revealed, setRevealed] = useState(false);
    const [seen, setSeen] = useState(0);

    const next = () => {
        setEntry(pickRandom(practicePool));
        setRevealed(false);
        const count = seen + 1;
        setSeen(count);
        trackAction('VIEW');
        if (count % 5 === 0) completeDailyTask();
    };

    useCardKeys({ revealed, onReveal: () => setRevealed(true), onNumber: n => n === 1 && next() });

    return (
        <>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-400 dark:text-indigo-300 mb-3 tabular-nums">
                {seen} seen this session · from {practicePool.length.toLocaleString()} words
            </p>
            <Flashcard entry={entry} revealed={revealed} onReveal={() => setRevealed(true)} />
            <button
                type="button"
                onClick={next}
                className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-panel transition active:scale-[0.99]"
            >
                <Shuffle size={18} aria-hidden="true" /> Next Word
            </button>
        </>
    );
};

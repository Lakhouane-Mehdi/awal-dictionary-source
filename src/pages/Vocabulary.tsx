import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { usePageMeta } from '../hooks/usePageMeta';
import { ReviewSession } from '../components/flashcards/ReviewSession';
import { PracticeSession } from '../components/flashcards/PracticeSession';

type Mode = 'review' | 'practice';

const MODES: { id: Mode; label: string; description: string }[] = [
    { id: 'review', label: 'Review Saved Words', description: 'Your saved words come back just before you would forget them. Rate each one and the schedule adapts.' },
    { id: 'practice', label: 'Random Practice', description: 'Random words from the whole dictionary. Read the word, recall its meaning, then reveal to check.' },
];

export const Vocabulary = () => {
    // The mode lives in the URL, so "?mode=practice" can be linked and survives a reload
    const [params, setParams] = useSearchParams();
    const mode: Mode = params.get('mode') === 'practice' ? 'practice' : 'review';
    const active = MODES.find(m => m.id === mode)!;

    usePageMeta(
        'Vocabulary flashcards',
        'Learn Tamazight words with spaced-repetition flashcards built from your saved words, or practise with random words.',
        '/learn/vocabulary'
    );

    return (
        <div className="animate-in fade-in duration-300 max-w-2xl mx-auto">
            <PageHeader
                title="Vocabulary flashcards"
                description={active.description}
                crumbs={[{ label: 'Home', to: '/' }, { label: 'Learn', to: '/learn' }, { label: 'Vocabulary' }]}
            />

            <div role="tablist" aria-label="Flashcard mode" className="grid grid-cols-2 gap-1 p-1 mb-5 rounded-xl bg-sand-200 dark:bg-white/5">
                {MODES.map(m => (
                    <button
                        key={m.id}
                        type="button"
                        role="tab"
                        id={`mode-${m.id}`}
                        aria-selected={mode === m.id}
                        aria-controls="flashcard-panel"
                        onClick={() => setParams(m.id === 'review' ? {} : { mode: m.id }, { replace: true })}
                        className={`py-2 rounded-lg text-sm font-semibold transition ${mode === m.id
                            ? 'bg-white dark:bg-night-800 text-indigo-800 dark:text-sand-100 shadow-panel'
                            : 'text-indigo-500 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-sand-100'}`}
                    >
                        {m.label}
                    </button>
                ))}
            </div>

            <div role="tabpanel" id="flashcard-panel" aria-labelledby={`mode-${mode}`}>
                {mode === 'review' ? <ReviewSession /> : <PracticeSession />}
            </div>
        </div>
    );
};

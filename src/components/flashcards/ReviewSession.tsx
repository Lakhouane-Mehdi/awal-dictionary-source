import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Repeat, Check } from 'lucide-react';
import { dictionaryData, type DictionaryEntry } from '../../data/dictionary';
import { useFavorites } from '../../hooks/useFavorites';
import { useReviewSchedule } from '../../hooks/useReviewSchedule';
import { useGamification } from '../../context/GamificationContext';
import { useCardKeys } from '../../hooks/useCardKeys';
import { buildQueue, formatInterval, GRADES, nextDueDay, previewIntervals, type Grade } from '../../utils/srs';
import { daysBetween, localDay } from '../../utils/dates';
import { Flashcard } from './Flashcard';

/** New words introduced per session, so a big saved list is not one huge review */
const NEW_PER_SESSION = 15;

const entriesById = new Map<string, DictionaryEntry>(dictionaryData.map(e => [e.id, e]));

const GRADE_LABELS: Record<Grade, string> = { again: 'Again', hard: 'Hard', good: 'Good', easy: 'Easy' };
const GRADE_STYLES: Record<Grade, string> = {
    again: 'border-ruby-200 text-ruby-700 hover:bg-ruby-50 dark:border-ruby-800/60 dark:text-ruby-300 dark:hover:bg-ruby-900/30',
    hard: 'border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-white/15 dark:text-indigo-200 dark:hover:bg-white/5',
    good: 'border-accent-200 text-accent-700 hover:bg-accent-50 dark:border-accent-800/60 dark:text-accent-300 dark:hover:bg-accent-900/30',
    easy: 'border-accent-300 bg-accent-50 text-accent-800 hover:bg-accent-100 dark:border-accent-700/60 dark:bg-accent-900/30 dark:text-accent-200',
};

/** "tomorrow", "in 3 days" in the reader's language */
const relativeDay = (day: string, today: string) =>
    new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' }).format(daysBetween(today, day), 'day');

type Session =
    | { phase: 'intro' }
    | { phase: 'reviewing'; queue: string[]; reviewed: number }
    | { phase: 'done'; reviewed: number };

export const ReviewSession = () => {
    const { favorites, loaded } = useFavorites();
    const { schedule, grade } = useReviewSchedule();
    const { trackAction, completeDailyTask } = useGamification();
    const [session, setSession] = useState<Session>({ phase: 'intro' });
    const [revealed, setRevealed] = useState(false);
    const today = localDay();

    // Saved words that still exist in the dictionary
    const savedIds = useMemo(() => favorites.filter(id => entriesById.has(id)), [favorites]);
    const plan = useMemo(() => buildQueue(savedIds, schedule, today, NEW_PER_SESSION), [savedIds, schedule, today]);
    const current = session.phase === 'reviewing' ? entriesById.get(session.queue[0]) : undefined;

    const rate = (rating: Grade) => {
        if (session.phase !== 'reviewing' || !current) return;
        grade(current.id, rating);
        trackAction('VIEW');
        // A forgotten word comes back at the end of this session
        const rest = session.queue.slice(1);
        const queue = rating === 'again' ? [...rest, current.id] : rest;
        // Counts words finished for this session, not ratings: a word rated
        // "again" is only done once it is known
        const reviewed = session.reviewed + (rating === 'again' ? 0 : 1);
        setRevealed(false);
        if (queue.length) {
            setSession({ phase: 'reviewing', queue, reviewed });
        } else {
            setSession({ phase: 'done', reviewed });
            completeDailyTask();
        }
    };

    useCardKeys({
        revealed,
        onReveal: () => current && setRevealed(true),
        onNumber: n => GRADES[n - 1] && rate(GRADES[n - 1]),
    });

    if (!loaded) {
        return <p className="py-16 text-center text-indigo-400" role="status">Loading your saved words…</p>;
    }

    if (savedIds.length === 0) {
        return (
            <div className="glass-panel p-8 text-center">
                <Heart size={36} className="mx-auto mb-4 text-ruby-400" aria-hidden="true" />
                <h2 className="font-display text-2xl font-bold text-indigo-800 dark:text-sand-100 mb-2 text-balance">Save Words to Review Them</h2>
                <p className="text-indigo-500 dark:text-indigo-200 mb-6 max-w-md mx-auto">
                    Tap the heart on any word and it joins your review deck. Each word comes back just before
                    you would forget it.
                </p>
                <Link to="/browse" className="inline-flex px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition">
                    Browse the Dictionary
                </Link>
            </div>
        );
    }

    if (session.phase === 'reviewing' && current) {
        const intervals = previewIntervals(schedule[current.id], today);
        return (
            <>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-400 dark:text-indigo-300 mb-3 tabular-nums" aria-live="polite">
                    {session.queue.length} left · {session.reviewed} done
                </p>
                <Flashcard entry={current} revealed={revealed} onReveal={() => setRevealed(true)}>
                    <div className="mt-6">
                        <p className="text-sm text-indigo-500 dark:text-indigo-200 mb-3">How well did you know it?</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {GRADES.map((g, i) => (
                                <button
                                    key={g}
                                    type="button"
                                    onClick={() => rate(g)}
                                    className={`flex flex-col items-center gap-0.5 py-2.5 rounded-xl border font-semibold transition active:scale-95 ${GRADE_STYLES[g]}`}
                                >
                                    <span>{GRADE_LABELS[g]}</span>
                                    <span className="text-[11px] font-medium opacity-80 tabular-nums">
                                        <kbd className="hidden sm:inline mr-1">{i + 1}</kbd>
                                        {formatInterval(intervals[g])}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </Flashcard>
            </>
        );
    }

    const next = nextDueDay(savedIds, schedule, today);
    const finished = session.phase === 'done';

    return (
        <div className="glass-panel p-8 text-center">
            {finished ? (
                <Check size={36} className="mx-auto mb-4 text-accent-600" aria-hidden="true" />
            ) : (
                <Repeat size={36} className="mx-auto mb-4 text-accent-600" aria-hidden="true" />
            )}
            <h2 className="font-display text-2xl font-bold text-indigo-800 dark:text-sand-100 mb-2 text-balance">
                {finished ? `${session.reviewed} ${session.reviewed === 1 ? 'Word' : 'Words'} Reviewed` : plan.cards.length ? `${plan.cards.length} ${plan.cards.length === 1 ? 'Word' : 'Words'} to Review` : 'All Caught Up'}
            </h2>
            <p className="text-indigo-500 dark:text-indigo-200 mb-6">
                {plan.cards.length > 0
                    ? `${plan.dueCount} due and ${plan.newCount} new, from your ${savedIds.length} saved words.`
                    : next
                        ? `Your next review is ${relativeDay(next, today)}.`
                        : 'Save more words to keep learning.'}
                {plan.newWaiting > 0 && ` ${plan.newWaiting} more new words wait for later sessions.`}
            </p>
            {plan.cards.length > 0 && (
                <button
                    type="button"
                    onClick={() => {
                        setRevealed(false);
                        setSession({ phase: 'reviewing', queue: plan.cards, reviewed: 0 });
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-panel transition active:scale-[0.99]"
                >
                    <Repeat size={18} aria-hidden="true" /> {finished ? 'Review More' : 'Start Review'}
                </button>
            )}
        </div>
    );
};

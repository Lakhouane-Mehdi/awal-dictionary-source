// Spaced repetition, a simplified SM-2 (the method Anki grew from).
// After each review the learner rates how well they knew the word; the
// card then comes back after an interval that grows each time it is known
// and resets when it is forgotten. Pure functions, so the schedule is
// testable and independent of storage and UI.

import { addDays } from './dates';

export type Grade = 'again' | 'hard' | 'good' | 'easy';

export interface CardState {
    /** Days until the next review after the last one */
    interval: number;
    /** How fast the interval grows; lower for words that keep being forgotten */
    ease: number;
    /** The day the card is next due, "YYYY-MM-DD" */
    due: string;
    reviews: number;
    lapses: number;
}

export const GRADES: Grade[] = ['again', 'hard', 'good', 'easy'];

const START_EASE = 2.5;
const MIN_EASE = 1.3;
const MAX_INTERVAL = 365;

/** The state after reviewing a card on `today` and rating it `grade`. */
export const review = (state: CardState | undefined, grade: Grade, today: string): CardState => {
    const prev = state ?? { interval: 0, ease: START_EASE, due: today, reviews: 0, lapses: 0 };
    let { interval, ease } = prev;
    let { lapses } = prev;

    switch (grade) {
        case 'again':
            // Forgotten: start over, and grow more slowly from now on
            interval = 0;
            ease -= 0.2;
            lapses += 1;
            break;
        case 'hard':
            interval = Math.max(1, Math.round(interval * 1.2));
            ease -= 0.15;
            break;
        case 'good':
            interval = interval === 0 ? 1 : interval === 1 ? 3 : Math.round(interval * ease);
            break;
        case 'easy':
            interval = interval === 0 ? 4 : Math.round(interval * ease * 1.3);
            ease += 0.15;
            break;
    }

    interval = Math.min(interval, MAX_INTERVAL);
    return {
        interval,
        ease: Math.max(MIN_EASE, Math.round(ease * 100) / 100),
        due: addDays(today, interval),
        reviews: prev.reviews + 1,
        lapses,
    };
};

/** How long each rating would push the card back, for the button hints */
export const previewIntervals = (state: CardState | undefined, today: string): Record<Grade, number> =>
    Object.fromEntries(GRADES.map(g => [g, review(state, g, today).interval])) as Record<Grade, number>;

/** "now", "1 day", "3 days", "2 weeks", "4 months" */
export const formatInterval = (days: number): string => {
    if (days <= 0) return 'now';
    if (days === 1) return '1 day';
    if (days < 14) return `${days} days`;
    if (days < 60) return `${Math.round(days / 7)} weeks`;
    return `${Math.round(days / 30)} months`;
};

export interface ReviewQueue {
    /** Cards to review now: overdue first, then new ones */
    cards: string[];
    /** How many of `cards` are due reviews and how many are new */
    dueCount: number;
    newCount: number;
    /** New cards held back for later sessions */
    newWaiting: number;
}

/**
 * Today's queue: every card that is due, most overdue first, then up to
 * `newLimit` cards never reviewed, in the order they were saved.
 */
export const buildQueue = (
    ids: string[],
    states: Record<string, CardState>,
    today: string,
    newLimit: number,
): ReviewQueue => {
    const due = ids
        .filter(id => states[id] && states[id].due <= today)
        .sort((a, b) => states[a].due.localeCompare(states[b].due));
    const fresh = ids.filter(id => !states[id]);
    const newCards = fresh.slice(0, newLimit);
    return {
        cards: [...due, ...newCards],
        dueCount: due.length,
        newCount: newCards.length,
        newWaiting: fresh.length - newCards.length,
    };
};

/** The earliest day any card comes due after today, or undefined */
export const nextDueDay = (ids: string[], states: Record<string, CardState>, today: string): string | undefined =>
    ids
        .map(id => states[id]?.due)
        .filter((day): day is string => !!day && day > today)
        .sort()[0];

/** Accepts only well-formed saved states, so a corrupted entry is dropped rather than breaking reviews */
export const isCardState = (value: unknown): value is CardState => {
    if (typeof value !== 'object' || value === null) return false;
    const v = value as Record<string, unknown>;
    return (
        typeof v.interval === 'number' && v.interval >= 0 &&
        typeof v.ease === 'number' && v.ease >= MIN_EASE &&
        typeof v.due === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v.due) &&
        typeof v.reviews === 'number' && typeof v.lapses === 'number'
    );
};

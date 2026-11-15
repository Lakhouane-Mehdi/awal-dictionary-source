import { describe, it, expect } from 'vitest';
import { buildQueue, formatInterval, isCardState, nextDueDay, previewIntervals, review, type CardState } from '../utils/srs';
import { addDays, daysBetween, localDay } from '../utils/dates';

const TODAY = '2026-11-15';

describe('dates', () => {
    it('adds days across month and year ends', () => {
        expect(addDays('2026-11-29', 3)).toBe('2026-12-02');
        expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
        expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    });

    it('counts days between, including across a daylight-saving change', () => {
        expect(daysBetween('2026-03-27', '2026-03-31')).toBe(4);
        expect(daysBetween('2026-11-15', '2026-11-14')).toBe(-1);
    });

    it('formats the local calendar day', () => {
        expect(localDay(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
    });
});

describe('review', () => {
    it('grows the interval each time a new word is known', () => {
        const first = review(undefined, 'good', TODAY);
        expect(first).toMatchObject({ interval: 1, due: '2026-11-16', reviews: 1 });
        const second = review(first, 'good', first.due);
        expect(second.interval).toBe(3);
        const third = review(second, 'good', second.due);
        expect(third.interval).toBe(8); // 3 x 2.5, rounded
    });

    it('starts a forgotten word over and slows its growth', () => {
        const known = { interval: 20, ease: 2.5, due: TODAY, reviews: 5, lapses: 0 };
        const forgot = review(known, 'again', TODAY);
        expect(forgot).toMatchObject({ interval: 0, due: TODAY, lapses: 1, ease: 2.3 });
    });

    it('never lets ease fall below the floor', () => {
        let state: CardState | undefined;
        for (let i = 0; i < 20; i++) state = review(state, 'again', TODAY);
        expect(state!.ease).toBe(1.3);
    });

    it('caps the interval at a year', () => {
        const old = { interval: 300, ease: 3, due: TODAY, reviews: 9, lapses: 0 };
        expect(review(old, 'easy', TODAY).interval).toBe(365);
    });

    it('shows what each rating would do, in order', () => {
        const p = previewIntervals(undefined, TODAY);
        expect(p).toEqual({ again: 0, hard: 1, good: 1, easy: 4 });
    });
});

describe('buildQueue', () => {
    const states: Record<string, CardState> = {
        late: { interval: 3, ease: 2.5, due: '2026-11-10', reviews: 2, lapses: 0 },
        today: { interval: 1, ease: 2.5, due: TODAY, reviews: 1, lapses: 0 },
        later: { interval: 5, ease: 2.5, due: '2026-11-20', reviews: 3, lapses: 0 },
    };

    it('puts the most overdue first, then new words up to the limit', () => {
        const q = buildQueue(['today', 'n1', 'later', 'late', 'n2', 'n3'], states, TODAY, 2);
        expect(q).toEqual({ cards: ['late', 'today', 'n1', 'n2'], dueCount: 2, newCount: 2, newWaiting: 1 });
    });

    it('finds the next day something is due', () => {
        expect(nextDueDay(['late', 'today', 'later'], states, TODAY)).toBe('2026-11-20');
        expect(nextDueDay(['late'], states, TODAY)).toBeUndefined();
    });
});

describe('helpers', () => {
    it('formats intervals for the buttons', () => {
        expect([0, 1, 3, 21, 120].map(formatInterval)).toEqual(['now', '1 day', '3 days', '3 weeks', '4 months']);
    });

    it('rejects corrupted saved states', () => {
        expect(isCardState({ interval: 1, ease: 2.5, due: TODAY, reviews: 1, lapses: 0 })).toBe(true);
        expect(isCardState({ interval: -1, ease: 2.5, due: TODAY, reviews: 1, lapses: 0 })).toBe(false);
        expect(isCardState({ interval: 1, ease: 2.5, due: 'soon', reviews: 1, lapses: 0 })).toBe(false);
        expect(isCardState(null)).toBe(false);
    });
});

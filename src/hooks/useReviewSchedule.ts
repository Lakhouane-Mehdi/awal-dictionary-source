import { useCallback, useEffect, useState } from 'react';
import { readJSON, writeJSON } from '../utils/storage';
import { isCardState, review, type CardState, type Grade } from '../utils/srs';
import { localDay } from '../utils/dates';

const SCHEDULE_KEY = 'awal_review_schedule';

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

/** Saved schedules, dropping any entry that is not a valid card state */
const loadSchedule = (): Record<string, CardState> => {
    const saved = readJSON<Record<string, unknown>>(SCHEDULE_KEY, {}, isRecord);
    return Object.fromEntries(Object.entries(saved).filter(([, state]) => isCardState(state))) as Record<string, CardState>;
};

/**
 * When each saved word is next due for review. Entries stay when a word is
 * unsaved, so saving it again picks up where it left off.
 */
export const useReviewSchedule = () => {
    const [schedule, setSchedule] = useState<Record<string, CardState>>(loadSchedule);

    useEffect(() => writeJSON(SCHEDULE_KEY, schedule), [schedule]);

    const grade = useCallback((id: string, rating: Grade) => {
        setSchedule(prev => ({ ...prev, [id]: review(prev[id], rating, localDay()) }));
    }, []);

    return { schedule, grade };
};

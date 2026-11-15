import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { readJSON, readString, writeJSON, writeString } from '../utils/storage';
import { ACHIEVEMENTS, type UserStats } from '../data/achievements';

export type TrackedAction = 'SEARCH' | 'VIEW' | 'QUIZ';

interface GamificationContextType {
    stats: UserStats;
    unlocked: string[];
    trackAction: (action: TrackedAction) => void;
    completeDailyTask: () => void;
}

const STATS_KEY = 'awal_stats';
const UNLOCKED_KEY = 'awal_unlocked_achievements';
const LAST_PLAY_KEY = 'awal_last_play';

const DEFAULT_STATS: UserStats = { streak: 0, totalSearches: 0, wordsLearned: 0, quizzesCompleted: 0 };

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);
const isStringList = (value: unknown): value is string[] =>
    Array.isArray(value) && value.every(v => typeof v === 'string');

/** Saved stats, keeping only numeric fields so a corrupted value cannot break the counters */
const loadStats = (): UserStats => {
    const saved = readJSON<Record<string, unknown>>(STATS_KEY, {}, isRecord);
    const stats = { ...DEFAULT_STATS };
    for (const key of Object.keys(DEFAULT_STATS) as (keyof UserStats)[]) {
        const value = saved[key];
        if (typeof value === 'number' && Number.isFinite(value) && value >= 0) stats[key] = value;
    }
    return stats;
};

/** The visitor's calendar day, so a streak day ends at their midnight, not UTC's */
const localDay = (date: Date): string =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

/**
 * One shared copy of the learner's progress. Every page used to call a hook
 * with its own state, so a finished quiz did not reach the achievements
 * window or the streak counter until the page was reloaded, and the copies
 * could overwrite each other's saved stats.
 */
interface Progress {
    stats: UserStats;
    unlocked: string[];
}

/** Adds every achievement the stats now satisfy. Pure, so React may run it twice. */
const withUnlocks = (progress: Progress): Progress => {
    const fresh = ACHIEVEMENTS
        .filter(a => !progress.unlocked.includes(a.id) && a.condition(progress.stats))
        .map(a => a.id);
    return fresh.length ? { ...progress, unlocked: [...progress.unlocked, ...fresh] } : progress;
};

export const GamificationProvider = ({ children }: { children: React.ReactNode }) => {
    // Stats and unlocked achievements change together in one state update,
    // so an unlock can never be missed or counted twice
    const [progress, setProgress] = useState<Progress>(() =>
        withUnlocks({ stats: loadStats(), unlocked: readJSON(UNLOCKED_KEY, [], isStringList) }));
    const [lastPlayDate, setLastPlayDate] = useState<string | null>(() => readString(LAST_PLAY_KEY));
    const { stats, unlocked } = progress;

    useEffect(() => writeJSON(STATS_KEY, stats), [stats]);
    useEffect(() => writeJSON(UNLOCKED_KEY, unlocked), [unlocked]);

    const updateStats = useCallback((change: (stats: UserStats) => UserStats) => {
        setProgress(prev => withUnlocks({ ...prev, stats: change(prev.stats) }));
    }, []);

    const trackAction = useCallback((action: TrackedAction) => {
        updateStats(prev => ({
            ...prev,
            totalSearches: prev.totalSearches + (action === 'SEARCH' ? 1 : 0),
            wordsLearned: prev.wordsLearned + (action === 'VIEW' ? 1 : 0),
            quizzesCompleted: prev.quizzesCompleted + (action === 'QUIZ' ? 1 : 0),
        }));
    }, [updateStats]);

    const completeDailyTask = useCallback(() => {
        const now = new Date();
        const today = localDay(now);
        if (lastPlayDate === today) return;
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const continues = lastPlayDate === localDay(yesterday);
        updateStats(prev => ({ ...prev, streak: continues ? prev.streak + 1 : 1 }));
        setLastPlayDate(today);
        writeString(LAST_PLAY_KEY, today);
    }, [lastPlayDate, updateStats]);

    const value = useMemo(
        () => ({ stats, unlocked, trackAction, completeDailyTask }),
        [stats, unlocked, trackAction, completeDailyTask],
    );

    return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGamification = () => {
    const context = useContext(GamificationContext);
    if (!context) throw new Error('useGamification must be used within a GamificationProvider');
    return context;
};

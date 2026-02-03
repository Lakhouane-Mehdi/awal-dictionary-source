import { useState, useEffect } from 'react';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    condition: (stats: UserStats) => boolean;
}

export interface UserStats {
    streak: number;
    totalSearches: number;
    wordsLearned: number;
    quizzesCompleted: number;
}

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'novice_explorer',
        title: 'Novice Explorer',
        description: 'Performed your first search',
        icon: '🔍',
        condition: (stats) => stats.totalSearches >= 1
    },
    {
        id: 'seeker_of_wisdom',
        title: 'Seeker of Wisdom',
        description: 'Searched for 50 words',
        icon: '📚',
        condition: (stats) => stats.totalSearches >= 50
    },
    {
        id: 'polyglot_training',
        title: 'Polyglot in Training',
        description: 'Viewed 10 distinct words',
        icon: '🧠',
        condition: (stats) => stats.wordsLearned >= 10
    },
    {
        id: 'quiz_whiz',
        title: 'Quiz Whiz',
        description: 'Completed 5 quizzes',
        icon: '🎓',
        condition: (stats) => stats.quizzesCompleted >= 5
    },
    {
        id: 'daily_devotee',
        title: 'Daily Devotee',
        description: 'Reached a 3-day streak',
        icon: '🔥',
        condition: (stats) => stats.streak >= 3
    }
];

export const useGamification = () => {
    // Stats State
    const [stats, setStats] = useState<UserStats>(() => {
        const saved = localStorage.getItem('awal_stats');
        const defaultStats = { streak: 0, totalSearches: 0, wordsLearned: 0, quizzesCompleted: 0 };
        return saved ? { ...defaultStats, ...JSON.parse(saved) } : defaultStats;
    });

    // Unlocked Achievements
    const [unlocked, setUnlocked] = useState<string[]>(() => {
        const saved = localStorage.getItem('awal_unlocked_achievements');
        return saved ? JSON.parse(saved) : [];
    });

    const [lastPlayDate, setLastPlayDate] = useState<string | null>(() => {
        return localStorage.getItem('awal_last_play');
    });

    // Persist changes
    useEffect(() => {
        localStorage.setItem('awal_stats', JSON.stringify(stats));
    }, [stats]);

    useEffect(() => {
        localStorage.setItem('awal_unlocked_achievements', JSON.stringify(unlocked));
    }, [unlocked]);

    // Check for new achievements whenever stats change
    const checkAchievements = (currentStats: UserStats) => {
        const newUnlocks: string[] = [];
        ACHIEVEMENTS.forEach(ach => {
            if (!unlocked.includes(ach.id) && ach.condition(currentStats)) {
                newUnlocks.push(ach.id);
            }
        });

        if (newUnlocks.length > 0) {
            setUnlocked(prev => [...prev, ...newUnlocks]);
            // Could trigger a toast notification here
            // alert(`Achievement Unlocked: ${newUnlocks.length} new badges!`); 
        }
    };

    const trackAction = (action: 'SEARCH' | 'VIEW' | 'QUIZ') => {
        setStats(prev => {
            const next = { ...prev };
            if (action === 'SEARCH') next.totalSearches += 1;
            if (action === 'VIEW') next.wordsLearned += 1;
            if (action === 'QUIZ') next.quizzesCompleted += 1;

            checkAchievements(next);
            return next;
        });
    };

    const completeDailyTask = () => {
        const today = new Date().toISOString().split('T')[0];
        if (lastPlayDate === today) return;

        let newStreak = 1;
        if (lastPlayDate) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayString = yesterday.toISOString().split('T')[0];

            if (lastPlayDate === yesterdayString) {
                newStreak = stats.streak + 1;
            }
        }

        const newStats = { ...stats, streak: newStreak };
        setStats(newStats);
        setLastPlayDate(today);
        localStorage.setItem('awal_last_play', today);
        checkAchievements(newStats);
    };

    return {
        stats,
        unlocked,
        trackAction,
        completeDailyTask
    };
};

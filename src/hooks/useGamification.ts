import { useState } from 'react';

export const useGamification = () => {
    const [streak, setStreak] = useState(() => {
        const stored = localStorage.getItem('awal_streak');
        return stored ? parseInt(stored, 10) : 0;
    });
    const [lastPlayDate, setLastPlayDate] = useState<string | null>(() => {
        return localStorage.getItem('awal_last_play');
    });

    const completeDailyTask = () => {
        const today = new Date().toISOString().split('T')[0];

        // precise date handling
        if (lastPlayDate === today) return; // Already played today

        let newStreak = 1;
        if (lastPlayDate) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayString = yesterday.toISOString().split('T')[0];

            if (lastPlayDate === yesterdayString) {
                newStreak = streak + 1;
            }
        }

        setStreak(newStreak);
        setLastPlayDate(today);

        localStorage.setItem('awal_streak', newStreak.toString());
        localStorage.setItem('awal_last_play', today);
    };

    return {
        streak,
        lastPlayDate,
        completeDailyTask
    };
};

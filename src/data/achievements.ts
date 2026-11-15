// The badges a learner can unlock, and the stats they are earned from.

export interface UserStats {
    streak: number;
    totalSearches: number;
    wordsLearned: number;
    quizzesCompleted: number;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    condition: (stats: UserStats) => boolean;
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

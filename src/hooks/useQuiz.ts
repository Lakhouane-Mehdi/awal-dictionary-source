import { useState, useCallback } from 'react';
import { dictionaryData } from '../data/dictionary';
import type { DictionaryEntry } from '../data/dictionary';

export interface Question {
    id: number;
    question: string;
    options: string[];
    correct: number;
    originalEntry: DictionaryEntry;
}

// Fisher-Yates Shuffle Algorithm
function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

const getRandomDistractors = (correctEntry: DictionaryEntry, count: number): string[] => {
    const candidates = dictionaryData.filter(e => e.id !== correctEntry.id);
    const shuffled = shuffleArray(candidates);
    return shuffled.slice(0, count).map(e => e.definition);
};

const generateQuizSet = (count: number): Question[] => {
    const shuffledData = shuffleArray(dictionaryData);
    const targets = shuffledData.slice(0, count);

    return targets.map((entry, index) => {
        const distractors = getRandomDistractors(entry, 3);
        const correctAnswer = entry.definition;
        const allOptions = shuffleArray([...distractors, correctAnswer]);
        const correctIndex = allOptions.indexOf(correctAnswer);

        return {
            id: index,
            question: `What does "${entry.term_latin}" (${entry.term_tifinagh}) mean?`,
            options: allOptions,
            correct: correctIndex,
            originalEntry: entry
        };
    });
};

export const useQuiz = (questionCount: number = 5) => {
    // Initialize synchronously
    const [questions, setQuestions] = useState<Question[]>(() => generateQuizSet(questionCount));
    const [loading, setLoading] = useState(false);

    const generateQuestions = useCallback(() => {
        setLoading(true);
        // Small delay purely for UX (feeling of "loading" a new set), optional but nice
        // But we can make it purely synchronous if preferred. 
        // Let's keep a tiny 100ms delay to allow UI to show "resetting" state if needed,
        // or just set immediately. Let's set immediately but maybe toggle loading to force reset?

        // Actually, preventing state-in-effect issues is easier if we just update state.
        const newSet = generateQuizSet(questionCount);
        setQuestions(newSet);
        setLoading(false);
    }, [questionCount]);

    return { questions, loading, generateQuestions };
};

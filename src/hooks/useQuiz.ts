import { useState, useEffect, useCallback } from 'react';
import { dictionaryData } from '../data/dictionary';
import type { DictionaryEntry } from '../data/dictionary';

export interface Question {
    id: number;
    question: string;
    options: string[];
    correct: number;
    originalEntry: DictionaryEntry;
}

// Fisher-Yates Shuffle Algorithm for unbiased randomization
function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

const getRandomDistractors = (correctEntry: DictionaryEntry, count: number): string[] => {
    // Filter out the correct answer
    const candidates = dictionaryData.filter(e => e.id !== correctEntry.id);

    // Shuffle candidates securely
    const shuffled = shuffleArray(candidates);

    // Take first 'count' items and return their definitions or terms depending on mode
    // For now, let's assume standard mode: Question = Tifinagh/Latin, Options = Definition (English)
    return shuffled.slice(0, count).map(e => e.definition);
};

export const useQuiz = (questionCount: number = 5) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    const generateQuestions = useCallback(() => {
        setLoading(true);

        // 1. Shuffle full dictionary securely
        const shuffledData = shuffleArray(dictionaryData);

        // 2. Select target words
        const targets = shuffledData.slice(0, questionCount);

        const newQuestions: Question[] = targets.map((entry, index) => {
            // Generate 3 wrong answers
            const distractors = getRandomDistractors(entry, 3);
            const correctAnswer = entry.definition;

            // Combine and shuffle options
            const allOptions = shuffleArray([...distractors, correctAnswer]);
            const correctIndex = allOptions.indexOf(correctAnswer);

            return {
                id: index,
                question: `What does "${entry.term_latin}" (${entry.term_tifinagh}) mean?`,
                options: allOptions,
                correct: correctIndex, // Index of the correct definition
                originalEntry: entry
            };
        });

        // Add a small delay to simulate processing and ensure state creates a perception of "refresh"
        setTimeout(() => {
            setQuestions(newQuestions);
            setLoading(false);
        }, 100);

    }, [questionCount]);

    useEffect(() => {
        generateQuestions();
    }, [generateQuestions]);

    return { questions, loading, generateQuestions };
};

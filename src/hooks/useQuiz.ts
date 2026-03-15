import { useState, useCallback } from 'react';
import { dictionaryData } from '../data/dictionary';
import type { DictionaryEntry } from '../data/dictionary';

export type QuestionType = 'meaning' | 'tifinagh' | 'reverse';

export interface Question {
    id: number;
    type: QuestionType;
    question: string;
    options: string[];
    correct: number;
    originalEntry: DictionaryEntry;
}

function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Only use entries with non-trivial tifinagh so tifinagh questions make sense
const validPool = dictionaryData.filter(
    e => e.definition && e.definition.length > 2 && e.term_tifinagh && e.term_tifinagh.length > 1
);

const getDistractors = (correct: DictionaryEntry, field: keyof DictionaryEntry, count: number): string[] => {
    const candidates = validPool.filter(e => e.id !== correct.id && e[field]);
    return shuffleArray(candidates)
        .slice(0, count)
        .map(e => e[field] as string);
};

const buildQuestion = (entry: DictionaryEntry, index: number): Question => {
    const types: QuestionType[] = ['meaning', 'tifinagh', 'reverse'];
    const type = types[Math.floor(Math.random() * types.length)];

    if (type === 'meaning') {
        // "What does 'Azul' (ⴰⵣⵓⵍ) mean?"
        const distractors = getDistractors(entry, 'definition', 3);
        const allOptions = shuffleArray([...distractors, entry.definition]);
        return {
            id: index, type,
            question: `What does "${entry.term_latin}" (${entry.term_tifinagh}) mean?`,
            options: allOptions,
            correct: allOptions.indexOf(entry.definition),
            originalEntry: entry,
        };
    }

    if (type === 'tifinagh') {
        // "Which Tifinagh script is 'Azul'?"
        const distractors = getDistractors(entry, 'term_tifinagh', 3);
        const allOptions = shuffleArray([...distractors, entry.term_tifinagh]);
        return {
            id: index, type,
            question: `Which Tifinagh script writes "${entry.term_latin}"?`,
            options: allOptions,
            correct: allOptions.indexOf(entry.term_tifinagh),
            originalEntry: entry,
        };
    }

    // reverse: "Which word means '[definition]'?"
    const distractors = getDistractors(entry, 'term_latin', 3);
    const allOptions = shuffleArray([...distractors, entry.term_latin]);
    return {
        id: index, type,
        question: `Which word means "${entry.definition}"?`,
        options: allOptions,
        correct: allOptions.indexOf(entry.term_latin),
        originalEntry: entry,
    };
};

const generateQuizSet = (count: number): Question[] =>
    shuffleArray(validPool)
        .slice(0, count)
        .map((entry, index) => buildQuestion(entry, index));

export const useQuiz = (questionCount = 5) => {
    const [questions, setQuestions] = useState<Question[]>(() => generateQuizSet(questionCount));
    const [loading, setLoading] = useState(false);

    const generateQuestions = useCallback(() => {
        setLoading(true);
        setQuestions(generateQuizSet(questionCount));
        setLoading(false);
    }, [questionCount]);

    return { questions, loading, generateQuestions };
};

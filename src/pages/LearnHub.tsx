import { Link } from 'react-router-dom';
import { Type, Layers, BrainCircuit, BookOpen, Quote, Network } from 'lucide-react';
import type { ReactNode } from 'react';
import { PageHeader } from '../components/PageHeader';
import { usePageMeta } from '../hooks/usePageMeta';
import { useGamification } from '../hooks/useGamification';
import { tifinaghAlphabet } from '../data/tifinagh';
import { totalEntries, rootFamilies } from '../data/taxonomy';
import { proverbs } from '../data/proverbs';

interface Path {
    to: string;
    label: string;
    icon: ReactNode;
    meta: string;
    desc: string;
}

export const LearnHub = () => {
    const { stats } = useGamification();

    usePageMeta(
        'Learn Tamazight',
        'Learn the Tifinagh alphabet, practise vocabulary with flashcards, test yourself with quizzes, and explore Amazigh proverbs and word roots.',
        '/learn'
    );

    const paths: Path[] = [
        {
            to: '/alphabet',
            label: 'Tifinagh alphabet',
            icon: <Type size={22} />,
            meta: `${tifinaghAlphabet.length} letters`,
            desc: 'Learn every character, its name, and how to write it stroke by stroke.',
        },
        {
            to: '/learn/vocabulary',
            label: 'Vocabulary flashcards',
            icon: <Layers size={22} />,
            meta: `${totalEntries.toLocaleString()} words`,
            desc: 'Reveal-and-review cards drawn from the full dictionary.',
        },
        {
            to: '/tools/quiz',
            label: 'Quiz',
            icon: <BrainCircuit size={22} />,
            meta: 'Multiple choice',
            desc: 'Test what you have learned and build a daily streak.',
        },
        {
            to: '/tools/conjugator',
            label: 'Verb conjugator',
            icon: <BookOpen size={22} />,
            meta: 'All tenses',
            desc: 'Full conjugation tables for preterite, intensive, and future.',
        },
        {
            to: '/proverbs',
            label: 'Proverbs',
            icon: <Quote size={22} />,
            meta: `${proverbs.length} sayings`,
            desc: 'Traditional inzan with translations and the meaning behind each.',
        },
        {
            to: '/roots',
            label: 'Word roots',
            icon: <Network size={22} />,
            meta: `${rootFamilies.length} families`,
            desc: 'See how Tamazight builds families of words from shared consonants.',
        },
    ];

    return (
        <div className="animate-in fade-in duration-300">
            <PageHeader
                title="Learn Tamazight"
                tifinagh="ⵍⵎⴷ"
                meta={`${stats.wordsLearned} XP · ${stats.streak} day streak`}
                description="Start with the alphabet, build vocabulary with flashcards, then test yourself. Every path works offline."
                crumbs={[{ label: 'Home', to: '/' }, { label: 'Learn' }]}
            />

            <div className="grid gap-4 sm:grid-cols-2">
                {paths.map(path => (
                    <Link
                        key={path.to}
                        to={path.to}
                        className="glass-panel p-6 group hover:shadow-panel-lg transition-all"
                    >
                        <div className="flex items-start gap-4">
                            <span className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-white/5 flex items-center justify-center text-indigo-600 dark:text-indigo-200 shrink-0 group-hover:text-saffron-600 dark:group-hover:text-saffron-300 transition-colors">
                                {path.icon}
                            </span>
                            <div className="min-w-0">
                                <h2 className="font-display text-lg font-bold text-indigo-800 dark:text-sand-100 group-hover:text-saffron-600 dark:group-hover:text-saffron-300 transition-colors">
                                    {path.label}
                                </h2>
                                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-400 dark:text-indigo-300 mt-0.5">
                                    {path.meta}
                                </p>
                                <p className="text-sm text-indigo-500 dark:text-indigo-200 mt-2 leading-relaxed">
                                    {path.desc}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

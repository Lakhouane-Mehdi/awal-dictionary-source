import { useNavigate } from 'react-router-dom';
import { Camera, BookOpen, BrainCircuit, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageHeader } from '../components/PageHeader';
import { usePageMeta } from '../hooks/usePageMeta';

export const Tools = () => {
    const navigate = useNavigate();

    usePageMeta(
        'Tools',
        'Translate Tifinagh from a photo, conjugate Tamazight verbs across all tenses, and test your vocabulary.',
        '/tools'
    );

    const tools = [
        {
            id: 'scan',
            label: 'Scan to Translate',
            icon: <Camera size={22} />,
            desc: 'Point your camera at Tifinagh text and read it back in Latin script.',
            path: '/tools/scan'
        },
        {
            id: 'conjugator',
            label: 'Verb Conjugator',
            icon: <BookOpen size={22} />,
            desc: 'Full conjugation tables for preterite, intensive, and future forms.',
            path: '/tools/conjugator'
        },
        {
            id: 'quiz',
            label: 'Daily Quiz',
            icon: <BrainCircuit size={22} />,
            desc: 'Test your vocabulary and keep a daily streak going.',
            path: '/tools/quiz'
        },
        {
            id: 'community',
            label: 'Community',
            icon: <Users size={22} />,
            desc: 'Suggest new words, corrections, and dialect variants.',
            path: '/tools/community'
        }
    ];

    return (
        <div className="animate-in fade-in duration-300">
            <PageHeader
                title="Tools"
                tifinagh="ⵉⵎⴰⵙⵙⵏ"
                description="Utilities that go beyond lookup — translate from a photo, conjugate any verb, and test what you know."
                crumbs={[{ label: 'Home', to: '/' }, { label: 'Tools' }]}
            />

            <div className="grid gap-4 sm:grid-cols-2">
                {tools.map((tool, index) => (
                    <motion.button
                        key={tool.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.06 }}
                        onClick={() => navigate(tool.path)}
                        className="glass-panel p-6 flex items-start gap-4 text-left group hover:shadow-panel-lg transition-all"
                    >
                        <span className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-white/5 flex items-center justify-center text-indigo-600 dark:text-indigo-200 shrink-0 group-hover:text-saffron-600 dark:group-hover:text-saffron-300 transition-colors">
                            {tool.icon}
                        </span>
                        <div>
                            <h2 className="font-display text-lg font-bold text-indigo-800 dark:text-sand-100 group-hover:text-saffron-600 dark:group-hover:text-saffron-300 transition-colors">
                                {tool.label}
                            </h2>
                            <p className="text-sm text-indigo-500 dark:text-indigo-200 mt-1 leading-relaxed">{tool.desc}</p>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

import { useNavigate } from 'react-router-dom';
import { Camera, BookOpen, BrainCircuit, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export const Tools = () => {
    const navigate = useNavigate();

    const tools = [
        {
            id: 'scan',
            label: 'Scan to Translate',
            icon: <Camera size={32} />,
            desc: 'Use camera to translate Tifinagh',
            color: 'text-blue-500',
            path: '/tools/scan'
        },
        {
            id: 'conjugator',
            label: 'Verb Conjugator',
            icon: <BookOpen size={32} />,
            desc: 'Conjugate verbs in all tenses',
            color: 'text-green-500',
            path: '/tools/conjugator'
        },
        {
            id: 'quiz',
            label: 'Daily Quiz',
            icon: <BrainCircuit size={32} />,
            desc: 'Test your vocabulary',
            color: 'text-purple-500',
            path: '/tools/quiz'
        },
        {
            id: 'community',
            label: 'Community',
            icon: <Users size={32} />,
            desc: 'Suggest words & discuss',
            color: 'text-orange-500',
            path: '/tools/community'
        }
    ];

    return (
        <div className="p-4 w-full max-w-md mx-auto min-h-screen">
            <header className="mb-8 mt-2">
                <h1 className="text-2xl font-bold mb-1 text-[var(--color-primary)]">Tools</h1>
                <p className="text-sm text-[var(--color-text-muted)]">Advanced learning utilities</p>
            </header>

            <div className="grid grid-cols-2 gap-4">
                {tools.map((tool, index) => (
                    <motion.button
                        key={tool.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => navigate(tool.path)}
                        className="glass-panel p-6 flex flex-col items-center text-center hover:scale-[1.02] transition-transform aspect-square justify-center"
                    >
                        <div className={`mb-4 ${tool.color}`}>{tool.icon}</div>
                        <h3 className="font-bold text-lg mb-1">{tool.label}</h3>
                        <p className="text-xs text-[var(--color-text-muted)]">{tool.desc}</p>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

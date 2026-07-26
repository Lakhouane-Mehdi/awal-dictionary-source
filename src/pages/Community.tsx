import { useState } from 'react';
import { PenLine, Users, BarChart3 } from 'lucide-react';
import { GithubIcon } from '../components/icons/GithubIcon';
import { ContributionModal } from '../components/ContributionModal';
import { dictionaryData } from '../data/dictionary';
import { PROJECT_REPO } from '../utils/author';

export const Community = () => {
    const [isContribOpen, setIsContribOpen] = useState(false);

    const stats = [
        { label: 'Words', value: dictionaryData.length.toLocaleString() },
        { label: 'Sources', value: '4' },
        { label: 'Scripts', value: '3' },
        { label: 'Dialects', value: '4' },
    ];

    return (
        <div className="w-full pb-20 pt-4">
            <header className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <Users className="text-orange-500" size={28} />
                    <h1 className="text-3xl font-black bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                        Community
                    </h1>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Help grow the Tamazight dictionary
                </p>
            </header>

            {/* Dictionary Stats */}
            <div className="glass-panel p-5 mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <BarChart3 size={16} className="text-blue-500" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Dictionary Stats</h3>
                </div>
                <div className="grid grid-cols-4 gap-3">
                    {stats.map(s => (
                        <div key={s.label} className="text-center">
                            <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{s.value}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contribute a word */}
            <div className="glass-panel p-6 mb-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                        <PenLine size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Suggest a Word</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Submit new words or corrections via email</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setIsContribOpen(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
                >
                    Open Contribution Form
                </button>
            </div>

            {/* GitHub */}
            <div className="glass-panel p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                        <GithubIcon size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Open Source</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Contribute data and code on GitHub</p>
                    </div>
                </div>
                <a
                    href={PROJECT_REPO}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl hover:border-slate-400 dark:hover:border-slate-500 transition-all active:scale-95"
                >
                    <GithubIcon size={18} /> View on GitHub
                </a>
            </div>

            <ContributionModal isOpen={isContribOpen} onClose={() => setIsContribOpen(false)} />
        </div>
    );
};

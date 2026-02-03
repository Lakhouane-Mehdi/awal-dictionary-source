import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Lock } from 'lucide-react';
import { useGamification, ACHIEVEMENTS } from '../hooks/useGamification';

interface AchievementsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AchievementsModal = ({ isOpen, onClose }: AchievementsModalProps) => {
    const { stats, unlocked } = useGamification();

    const progress = Math.round((unlocked.length / ACHIEVEMENTS.length) * 100);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="relative h-40 bg-gradient-to-br from-yellow-300 to-amber-500 flex flex-col items-center justify-center text-white overflow-hidden shadow-sm">
                            <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse-slow"></div>
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors z-10"
                            >
                                <X size={20} />
                            </button>

                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Trophy size={48} className="mb-3 drop-shadow-md" />
                            </motion.div>
                            <h2 className="text-2xl font-black tracking-tight drop-shadow-sm mb-1">Your Journey</h2>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-90 bg-black/10 px-3 py-1 rounded-full">Level {Math.floor(unlocked.length / 2) + 1}</p>
                        </div>

                        {/* Progress Bar */}
                        <div className="px-6 -mt-4 relative z-10">
                            <div className="bg-white dark:bg-slate-800 p-1 rounded-full shadow-lg flex items-center gap-3">
                                <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-1000"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 pr-2">{progress}%</span>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-2 p-4">
                            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-center">
                                <span className="block text-2xl font-black text-slate-800 dark:text-slate-100">{stats.streak}</span>
                                <span className="text-[10px] uppercase font-bold text-slate-400">Day Streak</span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-center">
                                <span className="block text-2xl font-black text-slate-800 dark:text-slate-100">{stats.totalSearches}</span>
                                <span className="text-[10px] uppercase font-bold text-slate-400">Searches</span>
                            </div>
                        </div>

                        {/* Achievements List */}
                        <div className="px-6 pb-6 max-h-[300px] overflow-y-auto custom-scrollbar">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">Badges</h3>
                            <div className="space-y-3">
                                {ACHIEVEMENTS.map((achievement) => {
                                    const isUnlocked = unlocked.includes(achievement.id);
                                    return (
                                        <div
                                            key={achievement.id}
                                            className={`flex items-center gap-4 p-3 rounded-2xl border-2 transition-all ${isUnlocked ? 'border-amber-100 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-900/10' : 'border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50 opacity-60'}`}
                                        >
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-inner ${isUnlocked ? 'bg-white dark:bg-slate-800' : 'bg-slate-200 dark:bg-slate-700 grayscale'}`}>
                                                {isUnlocked ? achievement.icon : <Lock size={18} className="text-slate-400" />}
                                            </div>
                                            <div>
                                                <h4 className={`text-sm font-bold ${isUnlocked ? 'text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>
                                                    {achievement.title}
                                                </h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-500 leading-tight">
                                                    {achievement.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

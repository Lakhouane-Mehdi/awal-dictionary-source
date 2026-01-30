import { useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, ScrollText, Sparkles } from 'lucide-react';
import { proverbs } from '../data/proverbs';

export const ProverbCard = () => {
    const [dailyProverb] = useState(() => {
        // Simple "Day of Year" based rotation to pick a daily proverb
        const date = new Date();
        const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        const index = dayOfYear % proverbs.length;
        return proverbs[index];
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 border border-amber-100 dark:border-slate-700 shadow-xl"
        >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-8 text-amber-500/10 dark:text-amber-500/5">
                <Quote size={120} />
            </div>

            <div className="relative z-10 p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                        <ScrollText size={20} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-500">
                        Inzan (Wisdom of the Day)
                    </span>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    {/* Tifinagh */}
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 tifinagh-text leading-relaxed">
                        {dailyProverb.text_tifinagh}
                    </h3>

                    {/* Latin */}
                    <p className="text-lg font-serif italic text-slate-600 dark:text-slate-400 font-medium">
                        "{dailyProverb.text_latin}"
                    </p>

                    {/* Divider */}
                    <div className="w-12 h-1 bg-amber-300 dark:bg-amber-700/50 rounded-full my-4" />

                    {/* Meaning */}
                    <div className="bg-white/60 dark:bg-black/20 rounded-xl p-4 backdrop-blur-sm border border-white/40 dark:border-white/5">
                        <div className="flex items-start gap-3">
                            <Sparkles size={16} className="text-amber-500 mt-1 shrink-0" />
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-1">
                                    {dailyProverb.translation}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {dailyProverb.meaning}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer / Region */}
                <div className="mt-6 flex justify-end">
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                        Region: {dailyProverb.region || 'North Africa'}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

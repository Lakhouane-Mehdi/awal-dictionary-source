import { motion } from 'framer-motion';
import { Heart, Volume2, PenTool, BookOpen, Network, Sparkles } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { useAudio } from '../hooks/useAudio';
import { convertScript } from '../utils/scriptConverter';
import type { DictionaryEntry } from '../data/dictionary';

interface WordCardProps {
    entry: DictionaryEntry;
    dialect: string;
    script: 'latin' | 'tifinagh' | 'arabic';
    onConjugate: () => void;
    onTrace: () => void;
    onRoot: () => void;
}

const getCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
        case 'food': return 'from-orange-400 to-red-400';
        case 'culture': return 'from-purple-400 to-pink-400';
        case 'nature': return 'from-green-400 to-emerald-400';
        case 'people': return 'from-blue-400 to-cyan-400';
        case 'verbs': return 'from-amber-400 to-orange-500';
        default: return 'from-slate-400 to-gray-400';
    }
};

export const WordCard = ({ entry, dialect, script, onConjugate, onTrace, onRoot }: WordCardProps) => {
    const { isFavorite, toggleFavorite } = useFavorites();
    const { speak } = useAudio();
    const dialectTerm = (dialect !== 'all' && entry.dialects?.[dialect as keyof typeof entry.dialects])
        ? entry.dialects[dialect as keyof typeof entry.dialects]
        : entry.term_latin;

    const displayTitle = convertScript(dialectTerm || '', script);
    const subtitle = script === 'latin' ? entry.term_tifinagh : entry.term_latin;
    const isDifferent = dialectTerm !== entry.term_latin;

    // Semantic Color
    const accentGradient = getCategoryColor(entry.category);
    const favorite = isFavorite(entry.id);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="group relative glass-panel p-0 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-300 border-white/60 dark:border-white/5"
        >
            {/* Visual Cultural Background (Blurred) */}
            {entry.cultural_image && (
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-20 blur-sm pointer-events-none transition-opacity group-hover:opacity-15 dark:group-hover:opacity-30"
                    style={{ backgroundImage: `url(${entry.cultural_image})` }}
                />
            )}

            {/* Semantic Accent Line */}
            <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${accentGradient}`} />

            <div className="p-5 pl-7 relative cursor-pointer z-10 w-full">
                <div className="flex justify-between items-start mb-3 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-gradient-to-r ${accentGradient} text-white shadow-sm`}>
                                {entry.category || 'Term'}
                            </span>
                        </div>
                        <h2 className={`text-3xl font-black text-slate-800 dark:text-slate-100 ${script === 'tifinagh' ? 'tifinagh-text' : ''} leading-tight tracking-tight drop-shadow-sm`}>
                            {displayTitle}
                        </h2>
                        {isDifferent && script === 'latin' && <span className="text-sm text-slate-400 dark:text-slate-400 font-medium italic">General: {entry.term_latin}</span>}
                        <span className={`text-xl text-slate-500 dark:text-slate-300 font-medium block mt-1 ${script === 'latin' ? 'tifinagh-text' : ''} opacity-80`}>
                            {subtitle}
                        </span>
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(entry.id); }}
                        className={`p-2 rounded-full transition-colors ${favorite ? 'bg-red-50 text-red-500' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500'}`}
                    >
                        <Heart size={20} className={favorite ? "fill-current" : ""} strokeWidth={2} />
                    </button>
                </div>

                <p className="text-slate-600 dark:text-slate-200 font-medium leading-relaxed mb-4 text-lg">{entry.definition}</p>

                {/* Interaction Row */}
                <div className="flex flex-wrap gap-2 mt-4">
                    <button
                        onClick={(e) => { e.stopPropagation(); speak(entry.term_latin); }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 font-bold text-xs hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    >
                        <Volume2 size={16} /> LISTEN
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); onTrace(); }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        <PenTool size={16} /> TRACE
                    </button>

                    {entry.conjugation && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onConjugate(); }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300 font-bold text-xs hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
                        >
                            <BookOpen size={16} /> CONJUGATE
                        </button>
                    )}

                    {entry.root && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onRoot(); }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                        >
                            <Network size={16} /> ROOT
                        </button>
                    )}
                </div>

                {entry.dialects && dialect === 'all' && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100/50 dark:border-white/10">
                        {Object.entries(entry.dialects).map(([key, value]) => (
                            <div key={key} className="flex flex-col min-w-[60px]">
                                <span className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-0.5">{key}</span>
                                <span className={`text-xs font-semibold text-slate-700 dark:text-slate-300 ${script === 'tifinagh' ? 'tifinagh-text' : ''}`}>
                                    {convertScript(value, script)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Cultural Image (Bottom Semantic Card Style - Expanded) */}
            {entry.cultural_image && (
                <div className="relative h-40 w-full overflow-hidden mt-0">
                    <img src={entry.cultural_image} alt={entry.term_latin} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-4">
                        <div className="flex items-center gap-2 text-white/90">
                            <Sparkles size={16} className="text-yellow-400" />
                            <span className="text-xs font-bold uppercase tracking-wider">Cultural Insight</span>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

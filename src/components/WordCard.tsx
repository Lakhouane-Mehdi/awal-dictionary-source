import { motion } from 'framer-motion';
import { Heart, Volume2, PenTool, BookOpen, Network, Sparkles } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { useTTS } from '../hooks/useTTS';
import { convertScript } from '../utils/scriptConverter';
import type { DictionaryEntry } from '../data/dictionary';

interface WordCardProps {
    entry: DictionaryEntry;
    dialect: string;
    script: 'latin' | 'tifinagh' | 'arabic';
    onConjugate?: () => void;
    onTrace?: () => void;
    onRoot?: () => void;
}

// Category accents drawn from the heritage palette. Each category maps to a
// spine colour plus a matching low-contrast chip, so cards stay legible and
// the set reads as one family rather than a rainbow.
const CATEGORY_STYLES: Record<string, { spine: string; chip: string }> = {
    food: { spine: 'bg-clay-500', chip: 'bg-clay-50 text-clay-700 dark:bg-clay-900/30 dark:text-clay-200' },
    animals: { spine: 'bg-clay-400', chip: 'bg-clay-50 text-clay-700 dark:bg-clay-900/30 dark:text-clay-200' },
    body: { spine: 'bg-clay-600', chip: 'bg-clay-50 text-clay-700 dark:bg-clay-900/30 dark:text-clay-200' },
    culture: { spine: 'bg-saffron-500', chip: 'bg-saffron-50 text-saffron-800 dark:bg-saffron-900/30 dark:text-saffron-200' },
    greetings: { spine: 'bg-saffron-400', chip: 'bg-saffron-50 text-saffron-800 dark:bg-saffron-900/30 dark:text-saffron-200' },
    clothing: { spine: 'bg-saffron-600', chip: 'bg-saffron-50 text-saffron-800 dark:bg-saffron-900/30 dark:text-saffron-200' },
    colors: { spine: 'bg-saffron-300', chip: 'bg-saffron-50 text-saffron-800 dark:bg-saffron-900/30 dark:text-saffron-200' },
    verbs: { spine: 'bg-indigo-500', chip: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200' },
    pronouns: { spine: 'bg-indigo-400', chip: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200' },
    adjectives: { spine: 'bg-indigo-300', chip: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200' },
    numbers: { spine: 'bg-indigo-600', chip: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200' },
    nature: { spine: 'bg-emerald-600', chip: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200' },
    weather: { spine: 'bg-emerald-500', chip: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200' },
    places: { spine: 'bg-emerald-700', chip: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200' },
    family: { spine: 'bg-indigo-700', chip: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200' },
    people: { spine: 'bg-indigo-700', chip: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200' },
    time: { spine: 'bg-indigo-800', chip: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200' },
};

const DEFAULT_CATEGORY_STYLE = {
    spine: 'bg-sand-500 dark:bg-night-700',
    chip: 'bg-sand-200 text-indigo-600 dark:bg-white/10 dark:text-indigo-200',
};

const getCategoryStyle = (category?: string) =>
    CATEGORY_STYLES[category?.toLowerCase() ?? ''] ?? DEFAULT_CATEGORY_STYLE;

// Card actions share one outlined style so no single action shouts louder
// than the word and its definition.
const ACTION_BUTTON =
    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-700/12 dark:border-white/12 ' +
    'text-indigo-600 dark:text-indigo-200 font-semibold text-xs ' +
    'hover:border-saffron-400 hover:text-saffron-600 dark:hover:text-saffron-300 ' +
    'active:scale-95 transition-all';

export const WordCard = ({ entry, dialect, script, onConjugate, onTrace, onRoot }: WordCardProps) => {
    const { isFavorite, toggleFavorite } = useFavorites();
    const { speak, speaking } = useTTS();
    const dialectTerm = (dialect !== 'all' && entry.dialects?.[dialect as keyof typeof entry.dialects])
        ? entry.dialects[dialect as keyof typeof entry.dialects]
        : entry.term_latin;

    const displayTitle = convertScript(dialectTerm || '', script);
    const subtitle = script === 'latin' ? entry.term_tifinagh : entry.term_latin;
    const isDifferent = dialectTerm !== entry.term_latin;

    // Semantic Color
    const categoryStyle = getCategoryStyle(entry.category);
    const favorite = isFavorite(entry.id);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="group relative glass-panel p-0 overflow-hidden hover:shadow-panel-lg transition-all duration-300"
        >
            {/* Visual Cultural Background (Blurred) */}
            {entry.cultural_image && (
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-20 blur-sm pointer-events-none transition-opacity group-hover:opacity-15 dark:group-hover:opacity-30"
                    style={{ backgroundImage: `url(${entry.cultural_image})` }} /* dynamic URL — inline style required */
                />
            )}

            {/* Semantic Accent Line */}
            <div className={`absolute top-0 left-0 w-1 h-full ${categoryStyle.spine}`} />

            <div className="p-5 pl-7 relative cursor-pointer z-10 w-full">
                <div className="flex justify-between items-start mb-3 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`text-[10px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 rounded ${categoryStyle.chip}`}>
                                {entry.category || 'Term'}
                            </span>
                        </div>
                        <h2 className={`font-display text-3xl font-bold text-indigo-800 dark:text-sand-100 ${script === 'tifinagh' ? 'tifinagh-text' : ''} leading-tight tracking-tight`}>
                            {displayTitle}
                        </h2>
                        {isDifferent && script === 'latin' && <span className="text-sm text-indigo-400 dark:text-indigo-300 font-medium italic">General: {entry.term_latin}</span>}
                        <span className={`text-xl text-indigo-500 dark:text-indigo-200 font-medium block mt-1 ${script === 'latin' ? 'tifinagh-text' : ''}`}>
                            {subtitle}
                        </span>
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(entry.id); }}
                        className={`p-2 rounded-full transition-colors ${favorite ? 'bg-clay-50 text-clay-600 dark:bg-clay-900/30 dark:text-clay-300' : 'hover:bg-sand-200 dark:hover:bg-white/5 text-indigo-300 dark:text-indigo-400 hover:text-clay-500'}`}
                        title={favorite ? 'Remove from favorites' : 'Add to favorites'}
                        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        <Heart size={20} className={favorite ? "fill-current" : ""} strokeWidth={2} />
                    </button>
                </div>

                <p className="text-indigo-700 dark:text-indigo-100 leading-relaxed mb-4 text-base">{entry.definition}</p>

                {/* Interaction Row */}
                <div className="flex flex-wrap gap-2 mt-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!speaking) speak(entry.term_latin);
                        }}
                        className={`${ACTION_BUTTON} ${speaking ? 'text-saffron-600 dark:text-saffron-300 border-saffron-300 cursor-default' : ''}`}
                    >
                        <Volume2 size={15} className={speaking ? "animate-pulse" : ""} /> {speaking ? 'Playing' : 'Listen'}
                    </button>

                    {onTrace && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onTrace(); }}
                            className={ACTION_BUTTON}
                        >
                            <PenTool size={15} /> Trace
                        </button>
                    )}

                    {entry.conjugation && onConjugate && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onConjugate(); }}
                            className={ACTION_BUTTON}
                        >
                            <BookOpen size={15} /> Conjugate
                        </button>
                    )}

                    {entry.root && onRoot && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onRoot(); }}
                            className={ACTION_BUTTON}
                        >
                            <Network size={15} /> Root
                        </button>
                    )}
                </div>

                {entry.dialects && dialect === 'all' && (
                    <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-indigo-700/10 dark:border-white/10">
                        {Object.entries(entry.dialects).map(([key, value]) => (
                            <div key={key} className="flex flex-col min-w-[60px]">
                                <span className="text-[9px] uppercase tracking-[0.12em] text-indigo-400 dark:text-indigo-300 font-bold mb-0.5">{key}</span>
                                <span className={`text-xs font-semibold text-indigo-700 dark:text-indigo-100 ${script === 'tifinagh' ? 'tifinagh-text' : ''}`}>
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

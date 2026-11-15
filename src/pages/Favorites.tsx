import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../hooks/useFavorites';
import { dictionaryData } from '../data/dictionary';
import { useScript } from '../context/ScriptContext';
import { Heart, ArrowLeft, Repeat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { displayTerm } from '../utils/displayTerm';

export const Favorites = () => {
    const { favorites, toggleFavorite } = useFavorites();
    const { script } = useScript();

    const favoriteAndEntries = dictionaryData.filter(entry => favorites.includes(entry.id));

    return (
        <div className="w-full min-h-screen">
            <header className="mb-6 mt-4 flex items-center gap-4">
                <Link to="/" aria-label="Back to home" className="p-2 rounded-full hover:bg-white/50 text-slate-600 dark:text-indigo-200 transition-colors">
                    <ArrowLeft size={24} aria-hidden="true" />
                </Link>
                <h1 className="text-2xl font-black text-slate-800 dark:text-sand-100 flex-1">Saved Words</h1>
                {favoriteAndEntries.length > 0 && (
                    <Link
                        to="/learn/vocabulary"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition"
                    >
                        <Repeat size={16} aria-hidden="true" /> Review Them
                    </Link>
                )}
            </header>

            <div className="flex flex-col gap-4 pb-20">
                <AnimatePresence>
                    {favoriteAndEntries.length === 0 ? (
                        <div className="text-center text-slate-400 mt-20">
                            <Heart size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No favorites yet.</p>
                        </div>
                    ) : (
                        favoriteAndEntries.map(entry => (
                            <motion.div
                                key={entry.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="glass-panel p-4 flex justify-between items-center"
                            >
                                <Link to={`/word/${entry.id}`} className="flex-1 min-w-0 pr-2">
                                    <h2 className={`text-xl font-bold text-slate-800 dark:text-slate-100 truncate ${script === 'tifinagh' ? 'tifinagh-text' : ''}`}>
                                        {displayTerm(entry, script)}
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm truncate">{entry.definition}</p>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => toggleFavorite(entry.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full shrink-0"
                                    title="Remove from favorites"
                                    aria-label="Remove from favorites"
                                >
                                    <Heart size={20} className="fill-current" />
                                </button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

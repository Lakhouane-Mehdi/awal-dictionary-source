import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../hooks/useFavorites';
import { dictionaryData } from '../data/dictionary';
import { useScript } from '../context/ScriptContext';
import { Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { convertScript } from '../utils/scriptConverter';

export const Favorites = () => {
    const { favorites, toggleFavorite } = useFavorites();
    const { script } = useScript();

    const favoriteAndEntries = dictionaryData.filter(entry => favorites.includes(entry.id));

    return (
        <div className="w-full min-h-screen">
            <header className="mb-6 mt-4 flex items-center gap-4">
                <Link to="/" className="p-2 rounded-full hover:bg-white/50 text-slate-600 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-black text-slate-800">Saved Words</h1>
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
                                <div>
                                    <h2 className={`text-xl font-bold text-slate-800 ${script === 'tifinagh' ? 'tifinagh-text' : ''}`}>
                                        {convertScript(entry.term_latin, script)}
                                    </h2>
                                    <p className="text-slate-500 text-sm">{entry.definition}</p>
                                </div>
                                <button
                                    onClick={() => toggleFavorite(entry.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
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

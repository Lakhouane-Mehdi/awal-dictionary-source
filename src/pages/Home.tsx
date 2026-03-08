import { useSearch } from '../hooks/useSearch';
import { SearchBar } from '../components/SearchBar';
import { DialectToggle } from '../components/DialectToggle';
import type { DictionaryEntry } from '../data/dictionary';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useScript } from '../context/ScriptContext';
import { Eye, Sparkles, Moon, Sun, Info, Flame } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useGamification } from '../hooks/useGamification';
import { VerbConjugationModal } from '../components/VerbConjugationModal';
import { TraceModal } from '../components/TraceModal';
import { ProverbCard } from '../components/ProverbCard';
import { RootExplorerModal } from '../components/RootExplorerModal';
import { AboutModal } from '../components/AboutModal';
import { dictionaryData } from '../data/dictionary';
import { WordCard } from '../components/WordCard';



export const Home = () => {
    const { query, setQuery, results, suggestions, dialectFilter, setDialectFilter } = useSearch();
    const { script, toggleScript } = useScript();
    const { theme, toggleTheme } = useTheme();
    const { stats, trackAction } = useGamification();

    // Modal State
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [conjugationEntry, setConjugationEntry] = useState<DictionaryEntry | null>(null);
    const [traceCharacter, setTraceCharacter] = useState<string | null>(null);
    const [rootEntry, setRootEntry] = useState<DictionaryEntry | null>(null);

    // Smart Discovery Logic
    const [randomWord, setRandomWord] = useState<DictionaryEntry | null>(() => {
        if (results.length === 0) return null;
        const idx = Math.floor(Math.random() * results.length);
        return results[idx];
    });

    const handleShuffle = () => {
        const idx = Math.floor(Math.random() * results.length);
        setRandomWord(results[idx]);
        trackAction('VIEW');
    };

    const handleTrace = (char: string) => {
        setTraceCharacter(char);
        trackAction('VIEW');
    };

    // Helper to find related words
    const getRelatedWords = (entry: DictionaryEntry) => {
        if (!entry.root) return [];
        return dictionaryData.filter(d => d.root === entry.root && d.id !== entry.id);
    };

    return (
        <div className="w-full h-full relative">
            {/* Header */}
            <header className="mb-8 mt-4 flex justify-between items-center">
                <div onClick={() => setIsAboutOpen(true)} className="cursor-pointer group">
                    <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent flex items-center gap-2 group-hover:scale-105 transition-transform">
                        Awal <Sparkles size={18} className="text-yellow-400" />
                    </h1>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 tracking-wide mt-1 group-hover:text-blue-500 transition-colors">
                        {script === 'latin' ? 'PREMIUM DICTIONARY' :
                            script === 'tifinagh' ? 'ⴰⵎⴰⵡⴰⵍ ⴰⵎⴰⵣⵉⵖ' :
                                'القاموس الامازيغي'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsAboutOpen(true)}
                        className="w-12 h-12 glass-panel flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-lg hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                        title="About & Credits"
                    >
                        <Info size={24} />
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="w-12 h-12 glass-panel flex items-center justify-center text-slate-600 dark:text-yellow-400 shadow-lg hover:rotate-12 transition-transform duration-300"
                        title="Toggle Dark Mode"
                    >
                        {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                    </button>
                    <button
                        onClick={toggleScript}
                        className="w-12 h-12 glass-panel flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-lg hover:rotate-180 transition-transform duration-500"
                        title="Toggle Script (Magic Eye)"
                    >
                        <Eye size={24} strokeWidth={2.5} />
                    </button>
                    <div className="w-12 h-12 glass-panel flex flex-col items-center justify-center text-orange-500 shadow-lg" title="Daily Streak">
                        <Flame size={20} className={stats.streak > 0 ? "fill-orange-500 animate-pulse" : ""} />
                        <span className="text-[10px] font-bold">{stats.streak}</span>
                    </div>
                </div>
            </header>

            {/* Search Section */}
            <div className="sticky top-4 z-30 mb-6">
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    onClear={() => setQuery('')}
                />
            </div>

            {/* Content Switcher: Search Results vs Discovery */}
            {!query ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="mb-8">
                        <ProverbCard />
                    </div>

                    <div className="flex justify-between items-end mb-4">
                        <h3 className="text-lg font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            Word of the Moment
                        </h3>
                        <button
                            onClick={handleShuffle}
                            className="text-xs font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1 active:scale-95 transition-transform"
                        >
                            <Sparkles size={14} /> SHUFFLE
                        </button>
                    </div>

                    {randomWord && (
                        <WordCard
                            entry={randomWord}
                            dialect="all"
                            script={script}
                            onConjugate={() => setConjugationEntry(randomWord)}
                            onTrace={() => handleTrace(randomWord.term_tifinagh)}
                            onRoot={() => setRootEntry(randomWord)}
                        />
                    )}

                    <div className="mt-8">
                        <h3 className="text-lg font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                            Explore Categories
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {['Nature', 'Family', 'Food', 'Animals', 'Verbs'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setQuery(cat)}
                                    className="px-4 py-2 glass-panel text-sm font-bold text-slate-600 dark:text-slate-300 hover:scale-105 active:scale-95 transition-all"
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="mb-8">
                        <DialectToggle current={dialectFilter} onChange={setDialectFilter} />
                    </div>

                    <div className="flex flex-col gap-4 pb-20">
                        <AnimatePresence mode="popLayout">
                            {results.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="text-center text-slate-400 mt-12"
                                >
                                    <p className="text-lg font-medium">No words found.</p>
                                    <p className="text-sm">Try searching for "Bread" or "Water"</p>
                                    {suggestions.length > 0 && (
                                        <div className="mt-6 glass-panel p-4 max-w-xs mx-auto">
                                            <p className="text-sm font-bold text-blue-500 dark:text-blue-400 mb-2">Did you mean?</p>
                                            <div className="flex flex-wrap gap-2 justify-center">
                                                {suggestions.map((s) => (
                                                    <button
                                                        key={s}
                                                        onClick={() => setQuery(s)}
                                                        className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-semibold hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors active:scale-95"
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                results.map((entry) => (
                                    <WordCard
                                        key={entry.id}
                                        entry={entry}
                                        dialect={dialectFilter}
                                        script={script}
                                        onConjugate={() => setConjugationEntry(entry)}
                                        onTrace={() => handleTrace(entry.term_tifinagh)}
                                        onRoot={() => setRootEntry(entry)}
                                    />
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </>
            )}

            {/* Modals */}
            <TraceModal
                isOpen={!!traceCharacter}
                onClose={() => setTraceCharacter(null)}
                character={traceCharacter || ''}
            />

            {conjugationEntry && conjugationEntry.conjugation && (
                <VerbConjugationModal
                    isOpen={!!conjugationEntry}
                    onClose={() => setConjugationEntry(null)}
                    verbName={conjugationEntry.term_latin}
                    conjugation={conjugationEntry.conjugation}
                    script={script}
                />
            )}

            {rootEntry && (
                <RootExplorerModal
                    isOpen={!!rootEntry}
                    onClose={() => setRootEntry(null)}
                    entry={rootEntry}
                    relatedEntries={getRelatedWords(rootEntry)}
                />
            )}

            <AboutModal
                isOpen={isAboutOpen}
                onClose={() => setIsAboutOpen(false)}
            />
        </div>
    );
};



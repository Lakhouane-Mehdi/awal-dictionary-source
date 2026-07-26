import { useSearch } from '../hooks/useSearch';
import { SearchBar } from '../components/SearchBar';
import { DialectToggle } from '../components/DialectToggle';
import type { DictionaryEntry } from '../data/dictionary';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useScript } from '../context/ScriptContext';
import { Eye, Sparkles, Moon, Sun, Flame } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useGamification } from '../hooks/useGamification';
import { VerbConjugationModal } from '../components/VerbConjugationModal';
import { TraceModal } from '../components/TraceModal';
import { ProverbCard } from '../components/ProverbCard';
import { RootExplorerModal } from '../components/RootExplorerModal';
import { AboutModal } from '../components/AboutModal';
import { dictionaryData } from '../data/dictionary';
import { WordCard } from '../components/WordCard';
import { ContributionModal } from '../components/ContributionModal';
import { PenLine, BookOpen } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { tifinaghAlphabet } from '../data/tifinagh';
import { categories, rootFamilies } from '../data/taxonomy';
import { proverbs } from '../data/proverbs';



export const Home = () => {
    const { query, setQuery, results, suggestions, dialectFilter, setDialectFilter, loadMore, hasMore } = useSearch();
    const { script, toggleScript } = useScript();
    const { theme, toggleTheme } = useTheme();
    const { stats, trackAction } = useGamification();
    const navigate = useNavigate();

    // Modal State
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [conjugationEntry, setConjugationEntry] = useState<DictionaryEntry | null>(null);
    const [traceCharacter, setTraceCharacter] = useState<string | null>(null);
    const [rootEntry, setRootEntry] = useState<DictionaryEntry | null>(null);
    const [isContributionOpen, setIsContributionOpen] = useState(false);

    // Smart Discovery Logic — always draw from full dictionary, not the search slice
    const [randomWord, setRandomWord] = useState<DictionaryEntry>(() => {
        const idx = Math.floor(Math.random() * dictionaryData.length);
        return dictionaryData[idx];
    });

    const handleShuffle = () => {
        const idx = Math.floor(Math.random() * dictionaryData.length);
        setRandomWord(dictionaryData[idx]);
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
                <button
                    type="button"
                    onClick={() => setIsAboutOpen(true)}
                    className="text-left group"
                    title="About & Credits"
                >
                    <h1 className="font-display text-3xl font-bold text-indigo-700 dark:text-sand-100 flex items-baseline gap-2 tracking-tight">
                        Awal
                        <span className="tifinagh-text text-lg text-saffron-500 font-normal">ⴰⵡⴰⵍ</span>
                    </h1>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-400 dark:text-indigo-300 mt-1 group-hover:text-saffron-500 transition-colors">
                        {script === 'latin' ? 'Tamazight–English Dictionary' :
                            script === 'tifinagh' ? 'ⴰⵎⴰⵡⴰⵍ ⴰⵎⴰⵣⵉⵖ' :
                                'القاموس الامازيغي'}
                    </p>
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={toggleTheme}
                        className="w-11 h-11 glass-panel flex items-center justify-center text-indigo-600 dark:text-saffron-300 hover:text-saffron-500 transition-colors"
                        title="Toggle dark mode"
                        aria-label="Toggle dark mode"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button
                        onClick={toggleScript}
                        className="w-11 h-11 glass-panel flex items-center justify-center text-indigo-600 dark:text-indigo-200 hover:text-saffron-500 transition-colors"
                        title="Switch script"
                        aria-label="Switch script"
                    >
                        <Eye size={20} strokeWidth={2.2} />
                    </button>
                    <div
                        className="w-11 h-11 glass-panel flex flex-col items-center justify-center text-clay-500 dark:text-clay-300"
                        title={`Daily streak: ${stats.streak} day${stats.streak === 1 ? '' : 's'}`}
                    >
                        <Flame size={17} className={stats.streak > 0 ? 'fill-current' : ''} />
                        <span className="text-[10px] font-bold leading-none mt-0.5">{stats.streak}</span>
                    </div>
                </div>
            </header>

            {/* Search Section */}
            <div className="sticky top-4 z-30 mb-6">
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    onClear={() => setQuery('')}
                    results={query ? results.slice(0, 8) : []}
                    onSelect={(entry) => navigate(`/word/${entry.id}`)}
                />
            </div>

            {/* Content Switcher: Search Results vs Discovery */}
            {!query ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Hero Section */}
                    <div className="mb-10 glass-panel p-8 sm:p-10">
                        <h2 className="font-display text-3xl sm:text-4xl font-bold text-indigo-800 dark:text-sand-100 mb-3 leading-tight tracking-tight">
                            A living record of Tamazight
                        </h2>
                        <p className="text-indigo-500 dark:text-indigo-200 mb-6 text-base leading-relaxed max-w-prose">
                            Search across three scripts and four dialects, learn the Tifinagh
                            alphabet, and explore the roots behind each word — fully offline.
                        </p>

                        {/* Corpus stats */}
                        <dl className="flex flex-wrap gap-x-8 gap-y-3 mb-8 border-t border-b border-indigo-700/10 dark:border-white/10 py-4">
                            {[
                                { label: 'Entries', value: dictionaryData.length.toLocaleString() },
                                { label: 'Scripts', value: '3' },
                                { label: 'Dialects', value: '4' },
                            ].map(stat => (
                                <div key={stat.label}>
                                    <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-400 dark:text-indigo-300">
                                        {stat.label}
                                    </dt>
                                    <dd className="font-display text-2xl font-bold text-indigo-700 dark:text-sand-100 mt-0.5">
                                        {stat.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                to="/browse"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-7 rounded-xl shadow-panel hover:shadow-panel-lg transition-all active:scale-[0.98] inline-flex items-center gap-2"
                            >
                                <BookOpen size={18} />
                                Browse the dictionary
                            </Link>
                            <button
                                onClick={() => setIsContributionOpen(true)}
                                className="border border-indigo-700/15 dark:border-white/15 text-indigo-600 dark:text-indigo-200 font-semibold py-3 px-7 rounded-xl hover:border-saffron-400 hover:text-saffron-600 transition-all active:scale-[0.98] inline-flex items-center gap-2"
                            >
                                <PenLine size={18} />
                                Contribute a word
                            </button>
                        </div>
                    </div>

                    {/* Explore the site */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
                        {[
                            { to: '/alphabet', label: 'Alphabet', meta: `${tifinaghAlphabet.length} letters` },
                            { to: '/categories', label: 'Categories', meta: `${categories.length} groups` },
                            { to: '/roots', label: 'Word roots', meta: `${rootFamilies.length} families` },
                            { to: '/proverbs', label: 'Proverbs', meta: `${proverbs.length} sayings` },
                        ].map(item => (
                            <Link
                                key={item.to}
                                to={item.to}
                                className="glass-panel p-4 group hover:shadow-panel-lg transition-all"
                            >
                                <p className="font-display font-bold text-indigo-800 dark:text-sand-100 group-hover:text-saffron-600 dark:group-hover:text-saffron-300 transition-colors">
                                    {item.label}
                                </p>
                                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-400 dark:text-indigo-300 mt-0.5">
                                    {item.meta}
                                </p>
                            </Link>
                        ))}
                    </div>

                    <div className="mb-8">
                        <ProverbCard />
                    </div>

                    <div className="flex justify-between items-end mb-4">
                        <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-400 dark:text-indigo-300 rule-accent">
                            Word of the moment
                        </h3>
                        <button
                            onClick={handleShuffle}
                            className="text-xs font-bold uppercase tracking-wider text-saffron-600 dark:text-saffron-400 hover:text-saffron-500 flex items-center gap-1.5 active:scale-95 transition-all"
                        >
                            <Sparkles size={14} /> Shuffle
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

                    <div className="mt-10">
                        <div className="flex justify-between items-end mb-4">
                            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-400 dark:text-indigo-300 rule-accent">
                                Browse by category
                            </h3>
                            <Link
                                to="/categories"
                                className="text-xs font-bold uppercase tracking-wider text-saffron-600 dark:text-saffron-400 hover:text-saffron-500 transition-colors"
                            >
                                See all
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {categories.slice(0, 14).map(cat => (
                                <Link
                                    key={cat.slug}
                                    to={`/category/${cat.slug}`}
                                    className="px-4 py-2 rounded-lg border border-indigo-700/10 dark:border-white/10 bg-white/50 dark:bg-white/5 text-sm font-semibold text-indigo-600 dark:text-indigo-200 hover:border-saffron-400 hover:text-saffron-600 dark:hover:text-saffron-300 active:scale-95 transition-all"
                                >
                                    {cat.name}
                                    <span className="text-indigo-400 dark:text-indigo-300 ml-1.5 font-normal">{cat.count}</span>
                                </Link>
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
                                    className="text-center mt-12"
                                >
                                    <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-200">No words found.</p>
                                    <p className="text-sm text-indigo-400 dark:text-indigo-300 mt-1">Try searching for "Bread" or "Water"</p>
                                    {suggestions.length > 0 && (
                                        <div className="mt-6 glass-panel p-4 max-w-xs mx-auto">
                                            <p className="text-xs font-bold uppercase tracking-wider text-indigo-400 dark:text-indigo-300 mb-3">Did you mean?</p>
                                            <div className="flex flex-wrap gap-2 justify-center">
                                                {suggestions.map((s) => (
                                                    <button
                                                        key={s}
                                                        onClick={() => setQuery(s)}
                                                        className="px-3 py-1.5 rounded-lg bg-saffron-50 dark:bg-saffron-900/25 text-saffron-700 dark:text-saffron-300 text-sm font-semibold hover:bg-saffron-100 dark:hover:bg-saffron-900/40 transition-colors active:scale-95"
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

                        {hasMore && (
                            <button
                                type="button"
                                onClick={loadMore}
                                className="w-full py-3 glass-panel text-sm font-semibold text-indigo-600 dark:text-indigo-200 hover:text-saffron-600 dark:hover:text-saffron-300 active:scale-[0.99] transition-all"
                            >
                                Load more words
                            </button>
                        )}
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

            <ContributionModal
                isOpen={isContributionOpen}
                onClose={() => setIsContributionOpen(false)}
            />
        </div>
    );
};



import { useState, useMemo } from 'react';
import { Search, ArrowLeft, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { dictionaryData } from '../data/dictionary';
// Fix: Import DictionaryEntry as type explicitly or ensure it's exported purely as type if needed.
// But easier here is to just use 'import type' if it's only used as type.
import type { DictionaryEntry } from '../data/dictionary';
import { convertScript } from '../utils/scriptConverter';
import { useScript } from '../context/ScriptContext';

export const VerbConjugator = () => {
    const navigate = useNavigate();
    const { script } = useScript(); // Use global script setting
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVerb, setSelectedVerb] = useState<DictionaryEntry | null>(null);

    // Filter for verbs that have conjugation data
    const verbList = useMemo(() => {
        return dictionaryData.filter(entry =>
            (entry.category === 'Verbs' || !!entry.conjugation) &&
            (entry.term_latin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.term_tifinagh.includes(searchTerm))
        );
    }, [searchTerm]);

    const handleSelectVerb = (verb: DictionaryEntry) => {
        setSelectedVerb(verb);
    };

    return (
        <div className="p-4 w-full max-w-md mx-auto min-h-screen pb-20">
            <header className="mb-6 mt-2 flex items-center gap-3">
                <button onClick={() => navigate('/tools')} className="p-2 hover:bg-[var(--glass-bg)] rounded-full border border-transparent hover:border-[var(--glass-border)] transition-all">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Verb Conjugator</h1>
            </header>

            <div className="glass-panel flex items-center p-2 mb-6 focus-within:ring-2 ring-blue-500/30 transition-all">
                <Search className="text-slate-400 ml-2" size={20} />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setSelectedVerb(null); // Reset selection on search
                    }}
                    placeholder="Search for a verb (e.g. 'Ech')..."
                    className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-lg text-slate-800 dark:text-slate-100 placeholder-slate-400"
                />
            </div>

            {selectedVerb && selectedVerb.conjugation ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="glass-panel p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 border-amber-100 dark:border-slate-700">
                        <div className="text-center mb-6">
                            <h2 className={`text-4xl font-black mb-2 ${script === 'tifinagh' ? 'tifinagh-text' : ''} text-slate-800 dark:text-slate-100`}>
                                {convertScript(selectedVerb.term_latin, script)}
                            </h2>
                            <p className="text-slate-500 text-lg font-medium">{selectedVerb.definition}</p>
                        </div>

                        <div className="space-y-8">
                            <ConjugationTable
                                title="Preterite (Izri)"
                                value={selectedVerb.conjugation.preterite}
                                script={script as 'latin' | 'tifinagh' | 'arabic'}
                            />
                            <ConjugationTable
                                title="Intensive (Urmir)"
                                value={selectedVerb.conjugation.intensive}
                                script={script as 'latin' | 'tifinagh' | 'arabic'}
                            />
                            <ConjugationTable
                                title="Future (Imal)"
                                value={selectedVerb.conjugation.future}
                                script={script as 'latin' | 'tifinagh' | 'arabic'}
                            />
                            {selectedVerb.conjugation.aorist && (
                                <ConjugationTable
                                    title="Imperative/Aorist"
                                    value={selectedVerb.conjugation.aorist}
                                    script={script as 'latin' | 'tifinagh' | 'arabic'}
                                />
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => setSelectedVerb(null)}
                        className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    >
                        Select Another Verb
                    </button>
                </motion.div>
            ) : (
                <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 px-2">Available Verbs</p>
                    {verbList.length > 0 ? (
                        verbList.map(verb => (
                            <button
                                key={verb.id}
                                onClick={() => handleSelectVerb(verb)}
                                className="w-full glass-panel p-4 flex items-center justify-between hover:scale-[1.02] active:scale-95 transition-all text-left group"
                            >
                                <div>
                                    <span className={`text-lg font-bold block group-hover:text-blue-600 transition-colors ${script === 'tifinagh' ? 'tifinagh-text' : ''}`}>
                                        {convertScript(verb.term_latin, script)}
                                    </span>
                                    <span className="text-sm text-slate-500">{verb.definition}</span>
                                </div>
                                <BookOpen size={20} className="text-slate-300 group-hover:text-blue-400" />
                            </button>
                        ))
                    ) : (
                        <div className="text-center py-10 text-slate-400">
                            <p>No verbs found matching "{searchTerm}"</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const ConjugationTable = ({ title, value, script }: { title: string, value: string, script: 'latin' | 'tifinagh' | 'arabic' }) => {
    // Note: The dictionary currently only provides a single string example for conjugation forms
    // In a real full app, we would parse this or have a full object per person.
    // For now, we display the provided form clearly.

    return (
        <div className="relative">
            <h3 className="text-xs font-bold uppercase text-amber-600 dark:text-amber-500 mb-2 tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> {title}
            </h3>
            <div className="glass-panel p-4 bg-white/50 dark:bg-black/20 text-center">
                <span className={`text-xl font-bold text-slate-800 dark:text-slate-200 ${script === 'tifinagh' ? 'tifinagh-text' : ''}`}>
                    {convertScript(value, script)}
                </span>
            </div>
        </div>
    );
};

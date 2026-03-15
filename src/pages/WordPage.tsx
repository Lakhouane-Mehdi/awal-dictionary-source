import { useParams, useNavigate } from 'react-router-dom';
import { dictionaryData } from '../data/dictionary';
import { WordCard } from '../components/WordCard';
import { useScript } from '../context/ScriptContext';
import { useTTS } from '../hooks/useTTS';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { useEffect } from 'react';
import tatoebaExamples from '../data/tatoeba_examples.json';

export const WordPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { script } = useScript();
    const { speak, speaking } = useTTS();

    const entry = dictionaryData.find(e => e.id === id);

    useEffect(() => {
        if (entry) {
            document.title = `${entry.term_latin} (${entry.definition}) - Awal Dictionary`;
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', `Learn about ${entry.term_latin} in Tamazight. Meaning: ${entry.definition}. Tifinagh: ${entry.term_tifinagh}.`);
            }
        }
    }, [entry]);

    if (!entry) {
        return (
            <div className="p-8 text-center text-slate-500">
                <p>Word not found.</p>
                <button onClick={() => navigate('/')} className="mt-4 text-blue-500 underline">Return Home</button>
            </div>
        );
    }

    // Real Tatoeba example sentences — filter for sentences containing this word
    const examples = (tatoebaExamples as { tamazight: string; english: string }[])
        .filter(ex => ex.tamazight.toLowerCase().includes(entry.term_latin.toLowerCase()))
        .slice(0, 3);

    return (
        <div className="max-w-3xl mx-auto w-full pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button 
                onClick={() => navigate(-1)} 
                className="mb-6 flex flex-row items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-xl w-fit font-semibold"
            >
                <ArrowLeft size={20} />
                Back to Search
            </button>

            <div className="mb-8">
                <WordCard 
                    entry={entry} 
                    dialect="all" 
                    script={script} 
                />
            </div>

            <div className="glass-panel p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest text-sm text-blue-500">Script Variants</h3>
                    <button
                        onClick={() => speak(entry.term_latin)}
                        className={`p-3 rounded-full transition-all ${speaking ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 scale-110' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'}`}
                        title="Pronounce Word"
                    >
                        <Volume2 size={24} className={speaking ? 'animate-pulse' : ''} />
                    </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-center">
                        <p className="text-xs font-bold text-slate-400 mb-1 uppercase">Latin</p>
                        <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{entry.term_latin}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-center">
                        <p className="text-xs font-bold text-slate-400 mb-1 uppercase">Tifinagh</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-200 font-tifinagh">{entry.term_tifinagh}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-center">
                        <p className="text-xs font-bold text-slate-400 mb-1 uppercase">Arabic</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{entry.term_arabic || '-'}</p>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest text-sm text-blue-500 mb-4">Example Sentences</h3>
                <div className="space-y-4">
                    {examples.map((ex, idx) => (
                        <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border-l-4 border-blue-500">
                            <p className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-1 italic">"{ex.tamazight}"</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{ex.english}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

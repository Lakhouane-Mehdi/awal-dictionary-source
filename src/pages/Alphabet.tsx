import { useState } from 'react';
import { PenTool } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { usePageMeta } from '../hooks/usePageMeta';
import { TraceModal } from '../components/TraceModal';
import { tifinaghAlphabet } from '../data/tifinagh';

export const Alphabet = () => {
    const [traceChar, setTraceChar] = useState<string | null>(null);

    usePageMeta(
        'Tifinagh alphabet',
        `The complete ${tifinaghAlphabet.length}-letter Neo-Tifinagh alphabet with names, Latin equivalents, and example words. Practise writing each character.`,
        '/alphabet'
    );

    return (
        <div className="animate-in fade-in duration-300">
            <PageHeader
                title="The Tifinagh alphabet"
                tifinagh="ⵜⵉⴼⵉⵏⴰⵖ"
                meta={`${tifinaghAlphabet.length} letters`}
                description="Tifinagh is the writing system of the Amazigh people, descended from the ancient Libyco-Berber script and standardised by IRCAM. Select any letter to practise writing it."
                crumbs={[{ label: 'Home', to: '/' }, { label: 'Alphabet' }]}
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {tifinaghAlphabet.map(letter => (
                    <button
                        key={letter.char}
                        type="button"
                        onClick={() => setTraceChar(letter.char)}
                        className="glass-panel p-5 text-center group hover:shadow-panel-lg transition-all"
                        title={`Practise writing ${letter.name}`}
                    >
                        <span className="tifinagh-text block text-5xl text-indigo-800 dark:text-sand-100 leading-none mb-3 group-hover:text-saffron-600 dark:group-hover:text-saffron-300 transition-colors">
                            {letter.char}
                        </span>
                        <p className="font-display text-lg font-bold text-indigo-700 dark:text-sand-100">
                            {letter.latin}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-400 dark:text-indigo-300 mt-0.5">
                            {letter.name}
                        </p>
                        <p className="text-xs text-indigo-500 dark:text-indigo-200 mt-2">
                            <span className="font-semibold">{letter.example}</span>
                            <span className="text-indigo-400 dark:text-indigo-300"> · {letter.exampleMeaning}</span>
                        </p>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-saffron-600 dark:text-saffron-400 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <PenTool size={11} /> Trace
                        </span>
                    </button>
                ))}
            </div>

            <TraceModal
                isOpen={!!traceChar}
                onClose={() => setTraceChar(null)}
                character={traceChar || ''}
            />
        </div>
    );
};

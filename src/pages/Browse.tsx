import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { usePageMeta } from '../hooks/usePageMeta';
import { WordRow } from '../components/WordRow';
import { ALPHABET_INDEX, entriesByLetter, letterCounts, totalEntries } from '../data/taxonomy';

const PAGE_SIZE = 50;

export const Browse = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const letter = (searchParams.get('letter') || 'A').toUpperCase();
    const [visible, setVisible] = useState(PAGE_SIZE);

    usePageMeta(
        `Browse ${letter}`,
        `Browse all Tamazight words beginning with ${letter}. ${totalEntries.toLocaleString()} entries across Tifinagh, Latin, and Arabic scripts.`,
        '/browse'
    );

    const entries = useMemo(() => entriesByLetter(letter), [letter]);

    const selectLetter = (next: string) => {
        setSearchParams({ letter: next });
        setVisible(PAGE_SIZE);
    };

    return (
        <div className="animate-in fade-in duration-300">
            <PageHeader
                title="Browse the dictionary"
                tifinagh="ⴰⵎⴰⵡⴰⵍ"
                meta={`${totalEntries.toLocaleString()} entries`}
                description="Every word in the dictionary, indexed by its first letter in the Latin transcription."
                crumbs={[{ label: 'Home', to: '/' }, { label: 'Browse' }]}
            />

            {/* Letter index */}
            <nav aria-label="Alphabet index" className="flex flex-wrap gap-1.5 mb-8">
                {ALPHABET_INDEX.map(l => {
                    const count = letterCounts[l] ?? 0;
                    const isActive = l === letter;
                    return (
                        <button
                            key={l}
                            type="button"
                            onClick={() => selectLetter(l)}
                            disabled={count === 0}
                            aria-current={isActive ? 'true' : undefined}
                            className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                                isActive
                                    ? 'bg-indigo-600 text-white shadow-panel'
                                    : count === 0
                                        ? 'text-indigo-300/40 dark:text-indigo-400/25 cursor-not-allowed'
                                        : 'text-indigo-600 dark:text-indigo-200 hover:bg-saffron-50 dark:hover:bg-white/5 hover:text-saffron-600'
                            }`}
                            title={`${count} word${count === 1 ? '' : 's'}`}
                        >
                            {l}
                        </button>
                    );
                })}
            </nav>

            <div className="glass-panel p-2 sm:p-3">
                <p className="px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-indigo-400 dark:text-indigo-300">
                    {entries.length.toLocaleString()} word{entries.length === 1 ? '' : 's'} starting with {letter}
                </p>

                {entries.length === 0 ? (
                    <p className="px-4 py-10 text-center text-indigo-400 dark:text-indigo-300">
                        No entries for this letter.
                    </p>
                ) : (
                    <div className="divide-y divide-indigo-700/5 dark:divide-white/5">
                        {entries.slice(0, visible).map(entry => (
                            <WordRow key={entry.id} entry={entry} />
                        ))}
                    </div>
                )}
            </div>

            {visible < entries.length && (
                <button
                    type="button"
                    onClick={() => setVisible(v => v + PAGE_SIZE)}
                    className="w-full mt-4 py-3 glass-panel text-sm font-semibold text-indigo-600 dark:text-indigo-200 hover:text-saffron-600 dark:hover:text-saffron-300 active:scale-[0.99] transition-all"
                >
                    Show more ({(entries.length - visible).toLocaleString()} remaining)
                </button>
            )}
        </div>
    );
};

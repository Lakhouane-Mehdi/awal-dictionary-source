import { Link } from 'react-router-dom';
import type { DictionaryEntry } from '../data/dictionary';
import { convertScript } from '../utils/scriptConverter';
import { useScript } from '../context/ScriptContext';

/**
 * Compact dictionary row used by the list pages (browse, category, root).
 * Denser than WordCard, which is reserved for featured/detail contexts.
 */
export const WordRow = ({ entry }: { entry: DictionaryEntry }) => {
    const { script } = useScript();

    return (
        <Link
            to={`/word/${entry.id}`}
            className="group flex items-baseline justify-between gap-4 px-4 py-3 rounded-xl border border-transparent hover:border-indigo-700/10 dark:hover:border-white/10 hover:bg-white/60 dark:hover:bg-white/5 transition-all"
        >
            <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                    <span className={`font-semibold text-indigo-800 dark:text-sand-100 group-hover:text-saffron-600 dark:group-hover:text-saffron-300 transition-colors ${script === 'tifinagh' ? 'tifinagh-text' : ''}`}>
                        {convertScript(entry.term_latin, script)}
                    </span>
                    {entry.category && (
                        <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-indigo-400 dark:text-indigo-300">
                            {entry.category}
                        </span>
                    )}
                </div>
                <p className="text-sm text-indigo-500 dark:text-indigo-200 truncate mt-0.5">
                    {entry.definition}
                </p>
            </div>
            <span className="tifinagh-text text-lg text-saffron-500/80 shrink-0" aria-hidden="true">
                {entry.term_tifinagh}
            </span>
        </Link>
    );
};

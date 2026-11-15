import { useParams, useNavigate, Link } from 'react-router-dom';
import { slugify } from '../data/taxonomy';
import { dictionaryData, idAliases } from '../data/dictionary';
import { WordCard } from '../components/WordCard';
import { useScript } from '../context/ScriptContext';
import { useTTS } from '../hooks/useTTS';
import { ArrowLeft, Volume2, MessageSquareDashed, Tag, Network } from 'lucide-react';
import { useEffect, useState } from 'react';
import tatoebaExamples from '../data/tatoeba_examples.json';
import { SITE_URL, DEFAULT_TITLE, DEFAULT_DESCRIPTION } from '../utils/seo';
import { convertScript } from '../utils/scriptConverter';
import { isLegacyId, resolveLegacyId } from '../utils/legacyIds';

const CONJUGATION_LABELS = [
    { key: 'aorist', label: 'Infinitive / Imperative' },
    { key: 'intensive', label: 'Present continuous' },
    { key: 'preterite', label: 'Past · I …' },
    { key: 'future', label: 'Future · I will …' },
] as const;

export const WordPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { script } = useScript();
    const { speak, speaking } = useTTS();

    const entry = dictionaryData.find(e => e.id === id);

    // Old links used position-based IDs ("imp_123"); send them to the entry's
    // current page. Remember a lookup that found nothing so it shows 404.
    const isOldLink = !entry && !!id && isLegacyId(id);

    // An entry merged into another one: go to the one that was kept
    const mergedInto = !entry && id ? idAliases.get(id) : undefined;
    useEffect(() => {
        if (mergedInto) navigate(`/word/${mergedInto}`, { replace: true });
    }, [mergedInto, navigate]);
    const [unresolvedId, setUnresolvedId] = useState<string | null>(null);
    useEffect(() => {
        if (!isOldLink || !id) return;
        let cancelled = false;
        resolveLegacyId(id).then(newId => {
            if (cancelled) return;
            if (newId) navigate(`/word/${newId}`, { replace: true });
            else setUnresolvedId(id);
        });
        return () => { cancelled = true; };
    }, [isOldLink, id, navigate]);

    useEffect(() => {
        const metaDescription = document.querySelector('meta[name="description"]');
        const canonical = document.querySelector('link[rel="canonical"]');

        if (entry) {
            document.title = `${entry.term_latin} (${entry.definition}) - Awal Dictionary`;
            metaDescription?.setAttribute(
                'content',
                `Learn about ${entry.term_latin} in Tamazight. Meaning: ${entry.definition}. Tifinagh: ${entry.term_tifinagh}.`
            );
            canonical?.setAttribute('href', `${SITE_URL}/word/${entry.id}`);
        }

        // Restore the site-wide defaults when leaving the page, otherwise the
        // tab and meta tags keep advertising the last word that was viewed.
        return () => {
            document.title = DEFAULT_TITLE;
            metaDescription?.setAttribute('content', DEFAULT_DESCRIPTION);
            canonical?.setAttribute('href', `${SITE_URL}/`);
        };
    }, [entry]);

    if (mergedInto || (isOldLink && unresolvedId !== id)) {
        return <div className="py-24 text-center text-indigo-400" role="status">Loading…</div>;
    }

    if (!entry) {
        return (
            <div className="p-8 text-center">
                <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-200">Word not found.</p>
                <p className="text-sm text-indigo-400 dark:text-indigo-300 mt-1">
                    That entry does not exist in the dictionary.
                </p>
                <div className="flex justify-center gap-3 mt-6">
                    <Link
                        to="/"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all active:scale-[0.98]"
                    >
                        Search
                    </Link>
                    <Link
                        to="/browse"
                        className="border border-indigo-700/15 dark:border-white/15 text-indigo-600 dark:text-indigo-200 font-semibold py-2.5 px-5 rounded-xl hover:border-saffron-400 hover:text-saffron-600 transition-all"
                    >
                        Browse A–Z
                    </Link>
                </div>
            </div>
        );
    }

    // Real Tatoeba example sentences — filter for sentences containing this word
    // Whole-word matches only: a substring test showed sentences with
    // "yessukkes" on the page for su (to drink)
    const wordPattern = new RegExp(
        `(^|[^\\p{L}])${entry.term_latin.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\p{L}]|$)`,
        'u',
    );
    const examples = entry.term_latin.length < 2 ? [] : (tatoebaExamples as { tamazight: string; english: string }[])
        .filter(ex => wordPattern.test(ex.tamazight.toLowerCase()))
        .slice(0, 3);

    return (
        <div className="max-w-3xl mx-auto w-full pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex flex-row items-center gap-2 text-indigo-500 dark:text-indigo-200 hover:text-saffron-600 dark:hover:text-saffron-300 transition-colors px-4 py-2 rounded-xl w-fit font-semibold border border-indigo-700/10 dark:border-white/10"
            >
                <ArrowLeft size={18} />
                Back
            </button>

            <div className="mb-6">
                <WordCard
                    entry={entry}
                    dialect="all"
                    script={script}
                />
            </div>

            {/* Connections into the rest of the site */}
            <div className="flex flex-wrap gap-2 mb-8">
                {entry.category && (
                    <Link
                        to={`/category/${slugify(entry.category)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-700/10 dark:border-white/10 text-sm font-semibold text-indigo-600 dark:text-indigo-200 hover:border-saffron-400 hover:text-saffron-600 transition-all"
                    >
                        <Tag size={14} /> More {entry.category.toLowerCase()} words
                    </Link>
                )}
                {entry.root && (
                    <Link
                        to={`/root/${slugify(entry.root)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-700/10 dark:border-white/10 text-sm font-semibold text-indigo-600 dark:text-indigo-200 hover:border-saffron-400 hover:text-saffron-600 transition-all"
                    >
                        <Network size={14} /> Root {entry.root}
                    </Link>
                )}
            </div>

            <div className="glass-panel p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-400 dark:text-indigo-300">Script variants</h2>
                    <button
                        onClick={() => speak(entry.term_latin)}
                        className={`p-3 rounded-full transition-all ${speaking ? 'bg-saffron-50 text-saffron-600 dark:bg-saffron-900/30 dark:text-saffron-300' : 'text-indigo-500 dark:text-indigo-300 hover:text-saffron-500'}`}
                        title="Pronounce Word"
                        aria-label="Pronounce word"
                    >
                        <Volume2 size={22} className={speaking ? 'animate-pulse' : ''} />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="border border-indigo-700/10 dark:border-white/10 p-4 rounded-xl text-center">
                        <p className="text-[10px] font-bold text-indigo-400 dark:text-indigo-300 mb-1 uppercase tracking-[0.12em]">Latin</p>
                        <p className="text-lg font-bold text-indigo-800 dark:text-sand-100">{entry.term_latin}</p>
                    </div>
                    <div className="border border-indigo-700/10 dark:border-white/10 p-4 rounded-xl text-center">
                        <p className="text-[10px] font-bold text-indigo-400 dark:text-indigo-300 mb-1 uppercase tracking-[0.12em]">Tifinagh</p>
                        <p className="text-2xl font-bold text-indigo-800 dark:text-sand-100 font-tifinagh">{entry.term_tifinagh}</p>
                    </div>
                    <div className="border border-indigo-700/10 dark:border-white/10 p-4 rounded-xl text-center">
                        <p className="text-[10px] font-bold text-indigo-400 dark:text-indigo-300 mb-1 uppercase tracking-[0.12em]">Arabic</p>
                        <p className="text-2xl font-bold text-indigo-800 dark:text-sand-100">{entry.term_arabic || '-'}</p>
                    </div>
                </div>
            </div>

            {entry.usage && (
                <div className="glass-panel p-6 mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-400 dark:text-indigo-300 mb-2">When it's used</h2>
                    <p className="text-indigo-800 dark:text-sand-100">{entry.usage}</p>
                </div>
            )}

            {entry.conjugation && (
                <div className="glass-panel p-6 mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-400 dark:text-indigo-300 mb-4">Conjugation</h2>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {CONJUGATION_LABELS.map(({ key, label }) => {
                            const form = entry.conjugation?.[key];
                            return form ? (
                                <div key={key} className="border border-indigo-700/10 dark:border-white/10 p-3 rounded-xl">
                                    <dt className="text-[10px] font-bold text-indigo-400 dark:text-indigo-300 uppercase tracking-[0.12em]">{label}</dt>
                                    <dd className={`text-lg font-bold text-indigo-800 dark:text-sand-100 ${script === 'tifinagh' ? 'tifinagh-text' : ''}`}>
                                        {convertScript(form, script)}
                                    </dd>
                                </div>
                            ) : null;
                        })}
                    </dl>
                </div>
            )}

            <div className="glass-panel p-6">
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-400 dark:text-indigo-300 mb-4">Example Sentences</h3>
                <div className="space-y-4">
                    {examples.length === 0 ? (
                        <div className="text-center py-6">
                            <MessageSquareDashed size={32} className="mx-auto mb-3 text-indigo-300 dark:text-indigo-400" />
                            <p className="text-indigo-500 dark:text-indigo-200 font-medium">
                                No example sentences yet for this word.
                            </p>
                            <p className="text-sm text-indigo-400 dark:text-indigo-300 mt-1">
                                Know one? Use the contribute button to help expand the dictionary.
                            </p>
                        </div>
                    ) : (
                        examples.map((ex, idx) => (
                            <div key={idx} className="border-l-4 border-saffron-400 bg-white/40 dark:bg-white/5 p-4 rounded-xl">
                                <p className="font-display text-lg italic text-indigo-800 dark:text-sand-100 mb-1">"{ex.tamazight}"</p>
                                <p className="text-sm text-indigo-500 dark:text-indigo-200">{ex.english}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

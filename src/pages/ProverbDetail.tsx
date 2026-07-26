import { useParams, Link } from 'react-router-dom';
import { Volume2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { usePageMeta } from '../hooks/usePageMeta';
import { proverbs } from '../data/proverbs';
import { useTTS } from '../hooks/useTTS';

export const ProverbDetail = () => {
    const { id = '' } = useParams<{ id: string }>();
    const proverb = proverbs.find(p => p.id === id);
    const { speak, speaking } = useTTS();

    usePageMeta(
        proverb ? `"${proverb.translation}"` : 'Proverb not found',
        proverb
            ? `Amazigh proverb: ${proverb.text_latin} — "${proverb.translation}". ${proverb.meaning}`
            : 'This proverb does not exist.',
        `/proverb/${id}`
    );

    if (!proverb) {
        return (
            <div className="animate-in fade-in duration-300">
                <PageHeader
                    title="Proverb not found"
                    description="That proverb does not exist."
                    crumbs={[{ label: 'Home', to: '/' }, { label: 'Proverbs', to: '/proverbs' }, { label: 'Not found' }]}
                />
                <Link to="/proverbs" className="text-saffron-600 dark:text-saffron-300 font-semibold hover:underline">
                    View all proverbs
                </Link>
            </div>
        );
    }

    const others = proverbs.filter(p => p.id !== proverb.id).slice(0, 4);

    return (
        <div className="animate-in fade-in duration-300">
            <PageHeader
                title="Proverb"
                tifinagh="ⵉⵏⵣⴰⵏ"
                meta={proverb.region}
                crumbs={[
                    { label: 'Home', to: '/' },
                    { label: 'Proverbs', to: '/proverbs' },
                    { label: proverb.translation },
                ]}
            />

            <article className="glass-panel p-8 mb-6">
                <p className="tifinagh-text text-3xl sm:text-4xl text-indigo-800 dark:text-sand-100 leading-relaxed mb-6">
                    {proverb.text_tifinagh}
                </p>

                <div className="flex items-start justify-between gap-4 mb-6">
                    <p className="font-display text-xl italic text-indigo-600 dark:text-indigo-200">
                        "{proverb.text_latin}"
                    </p>
                    <button
                        type="button"
                        onClick={() => speak(proverb.text_latin)}
                        className={`p-3 rounded-full shrink-0 transition-all ${speaking ? 'bg-saffron-50 text-saffron-600 dark:bg-saffron-900/30 dark:text-saffron-300' : 'text-indigo-500 dark:text-indigo-300 hover:text-saffron-500'}`}
                        title="Listen"
                        aria-label="Listen to this proverb"
                    >
                        <Volume2 size={20} className={speaking ? 'animate-pulse' : ''} />
                    </button>
                </div>

                <div className="border-t border-indigo-700/10 dark:border-white/10 pt-6">
                    <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-400 dark:text-indigo-300 mb-2">
                        Translation
                    </h2>
                    <p className="text-xl font-semibold text-indigo-800 dark:text-sand-100 mb-6">
                        {proverb.translation}
                    </p>

                    <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-400 dark:text-indigo-300 mb-2">
                        Meaning
                    </h2>
                    <p className="text-indigo-700 dark:text-indigo-100 leading-relaxed">
                        {proverb.meaning}
                    </p>
                </div>
            </article>

            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-400 dark:text-indigo-300 rule-accent mb-4">
                More proverbs
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
                {others.map(p => (
                    <Link
                        key={p.id}
                        to={`/proverb/${p.id}`}
                        className="glass-panel p-4 group hover:shadow-panel-lg transition-all"
                    >
                        <p className="font-display italic text-sm text-indigo-500 dark:text-indigo-200 mb-1">
                            "{p.text_latin}"
                        </p>
                        <p className="text-sm font-medium text-indigo-700 dark:text-indigo-100 group-hover:text-saffron-600 dark:group-hover:text-saffron-300 transition-colors">
                            {p.translation}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

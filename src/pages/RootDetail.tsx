import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { usePageMeta } from '../hooks/usePageMeta';
import { WordRow } from '../components/WordRow';
import { getRootBySlug, rootFamilies } from '../data/taxonomy';

export const RootDetail = () => {
    const { slug = '' } = useParams<{ slug: string }>();
    const family = getRootBySlug(slug);

    usePageMeta(
        family ? `Root ${family.root}` : 'Root not found',
        family
            ? `Words derived from the Tamazight root ${family.root}: ${family.entries.map(e => e.term_latin).join(', ')}.`
            : 'This root does not exist.',
        `/root/${slug}`
    );

    if (!family) {
        return (
            <div className="animate-in fade-in duration-300">
                <PageHeader
                    title="Root not found"
                    description="That root family does not exist."
                    crumbs={[{ label: 'Home', to: '/' }, { label: 'Roots', to: '/roots' }, { label: 'Not found' }]}
                />
                <Link to="/roots" className="text-saffron-600 dark:text-saffron-300 font-semibold hover:underline">
                    View all root families
                </Link>
            </div>
        );
    }

    // Etymology notes are authored per entry; surface any that exist.
    const notes = family.entries.filter(e => e.etymology);

    return (
        <div className="animate-in fade-in duration-300">
            <PageHeader
                title={family.root}
                meta={`${family.entries.length} words share this root`}
                description="Words in Tamazight are built by fitting vowel patterns around a fixed consonantal skeleton. These entries all derive from the same root."
                crumbs={[
                    { label: 'Home', to: '/' },
                    { label: 'Roots', to: '/roots' },
                    { label: family.root },
                ]}
            />

            {notes.length > 0 && (
                <div className="glass-panel p-6 mb-6 border-l-4 border-l-saffron-400">
                    <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-400 dark:text-indigo-300 mb-3">
                        Etymology
                    </h2>
                    <div className="space-y-3">
                        {notes.map(entry => (
                            <p key={entry.id} className="text-indigo-700 dark:text-indigo-100 leading-relaxed">
                                <span className="font-semibold">{entry.term_latin}</span>
                                {' — '}
                                {entry.etymology}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-400 dark:text-indigo-300 rule-accent mb-4">
                Words in this family
            </h2>

            <div className="glass-panel p-2 sm:p-3">
                <div className="divide-y divide-indigo-700/5 dark:divide-white/5">
                    {family.entries.map(entry => (
                        <WordRow key={entry.id} entry={entry} />
                    ))}
                </div>
            </div>

            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-400 dark:text-indigo-300 rule-accent mb-4 mt-10">
                Other roots
            </h2>
            <div className="flex flex-wrap gap-2">
                {rootFamilies
                    .filter(r => r.slug !== family.slug)
                    .slice(0, 12)
                    .map(r => (
                        <Link
                            key={r.slug}
                            to={`/root/${r.slug}`}
                            className="px-3 py-1.5 rounded-lg border border-indigo-700/10 dark:border-white/10 text-sm font-semibold tracking-wider text-indigo-600 dark:text-indigo-200 hover:border-saffron-400 hover:text-saffron-600 transition-all"
                        >
                            {r.root}
                        </Link>
                    ))}
            </div>
        </div>
    );
};

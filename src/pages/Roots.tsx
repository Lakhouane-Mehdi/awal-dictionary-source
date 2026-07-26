import { Link } from 'react-router-dom';
import { Network } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { usePageMeta } from '../hooks/usePageMeta';
import { rootFamilies } from '../data/taxonomy';

export const Roots = () => {
    usePageMeta(
        'Word roots',
        'Explore Tamazight consonantal roots and the word families built from them. Amazigh morphology derives related words from a shared skeleton of consonants.',
        '/roots'
    );

    return (
        <div className="animate-in fade-in duration-300">
            <PageHeader
                title="Word roots"
                tifinagh="ⵉⵥⵓⵕⴰⵏ"
                meta={`${rootFamilies.length} famil${rootFamilies.length === 1 ? 'y' : 'ies'}`}
                description="Tamazight builds meaning from consonantal roots. A single skeleton such as M-Gh-R yields words for greatness, seniority, and the matriarch of a family. These are the root families currently mapped in the dictionary."
                crumbs={[{ label: 'Home', to: '/' }, { label: 'Roots' }]}
            />

            {rootFamilies.length === 0 ? (
                <p className="glass-panel p-8 text-center text-indigo-400 dark:text-indigo-300">
                    No root families are mapped yet.
                </p>
            ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                    {rootFamilies.map(family => (
                        <Link
                            key={family.slug}
                            to={`/root/${family.slug}`}
                            className="glass-panel p-5 group hover:shadow-panel-lg transition-all"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Network size={15} className="text-saffron-500" aria-hidden="true" />
                                <span className="font-display text-xl font-bold tracking-[0.08em] text-indigo-800 dark:text-sand-100 group-hover:text-saffron-600 dark:group-hover:text-saffron-300 transition-colors">
                                    {family.root}
                                </span>
                            </div>
                            <p className="text-sm text-indigo-500 dark:text-indigo-200">
                                {family.entries.map(e => e.term_latin).join(' · ')}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-400 dark:text-indigo-300 mt-2">
                                {family.entries.length} words
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

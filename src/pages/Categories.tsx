import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { usePageMeta } from '../hooks/usePageMeta';
import { categories, totalEntries } from '../data/taxonomy';

export const Categories = () => {
    usePageMeta(
        'Categories',
        `Browse ${totalEntries.toLocaleString()} Tamazight words grouped by theme — food, family, nature, animals, verbs and more.`,
        '/categories'
    );

    return (
        <div className="animate-in fade-in duration-300">
            <PageHeader
                title="Categories"
                tifinagh="ⵜⵉⴳⵔⵓⵎⵎⴰ"
                meta={`${categories.length} groups`}
                description="Words grouped by theme. Each category lists every entry it contains."
                crumbs={[{ label: 'Home', to: '/' }, { label: 'Categories' }]}
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map(cat => (
                    <Link
                        key={cat.slug}
                        to={`/category/${cat.slug}`}
                        className="glass-panel p-5 group hover:shadow-panel-lg transition-all"
                    >
                        <p className="font-display text-lg font-bold text-indigo-800 dark:text-sand-100 group-hover:text-saffron-600 dark:group-hover:text-saffron-300 transition-colors">
                            {cat.name}
                        </p>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-400 dark:text-indigo-300 mt-1">
                            {cat.count.toLocaleString()} word{cat.count === 1 ? '' : 's'}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

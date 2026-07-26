import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { usePageMeta } from '../hooks/usePageMeta';
import { WordRow } from '../components/WordRow';
import { getCategoryBySlug, getEntriesByCategory, categories } from '../data/taxonomy';

const PAGE_SIZE = 60;

export const CategoryDetail = () => {
    const { slug = '' } = useParams<{ slug: string }>();
    const category = getCategoryBySlug(slug);
    const [visible, setVisible] = useState(PAGE_SIZE);

    usePageMeta(
        category ? `${category.name} words` : 'Category not found',
        category
            ? `${category.count} Tamazight words in the ${category.name} category, with English definitions and Tifinagh script.`
            : 'This category does not exist.',
        `/category/${slug}`
    );

    if (!category) {
        return (
            <div className="animate-in fade-in duration-300">
                <PageHeader
                    title="Category not found"
                    description="That category does not exist. Browse the full list instead."
                    crumbs={[{ label: 'Home', to: '/' }, { label: 'Categories', to: '/categories' }, { label: 'Not found' }]}
                />
                <div className="flex flex-wrap gap-2">
                    {categories.slice(0, 8).map(c => (
                        <Link
                            key={c.slug}
                            to={`/category/${c.slug}`}
                            className="px-4 py-2 rounded-lg border border-indigo-700/10 dark:border-white/10 text-sm font-semibold text-indigo-600 dark:text-indigo-200 hover:border-saffron-400 hover:text-saffron-600 transition-all"
                        >
                            {c.name}
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    const entries = getEntriesByCategory(category.name);

    return (
        <div className="animate-in fade-in duration-300">
            <PageHeader
                title={category.name}
                meta={`${category.count.toLocaleString()} word${category.count === 1 ? '' : 's'}`}
                description={`Every ${category.name.toLowerCase()} word in the dictionary, listed alphabetically.`}
                crumbs={[
                    { label: 'Home', to: '/' },
                    { label: 'Categories', to: '/categories' },
                    { label: category.name },
                ]}
            />

            <div className="glass-panel p-2 sm:p-3">
                <div className="divide-y divide-indigo-700/5 dark:divide-white/5">
                    {entries.slice(0, visible).map(entry => (
                        <WordRow key={entry.id} entry={entry} />
                    ))}
                </div>
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

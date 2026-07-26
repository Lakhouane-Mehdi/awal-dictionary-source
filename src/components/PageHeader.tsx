import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
    label: string;
    to?: string;
}

interface PageHeaderProps {
    title: string;
    tifinagh?: string;
    description?: string;
    crumbs?: Crumb[];
    meta?: string;
}

export const PageHeader = ({ title, tifinagh, description, crumbs, meta }: PageHeaderProps) => (
    <header className="mb-8">
        {crumbs && crumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-3">
                <ol className="flex items-center flex-wrap gap-1 text-xs text-indigo-400 dark:text-indigo-300">
                    {crumbs.map((crumb, i) => (
                        <li key={`${crumb.label}-${i}`} className="flex items-center gap-1">
                            {crumb.to ? (
                                <Link to={crumb.to} className="hover:text-saffron-600 dark:hover:text-saffron-300 transition-colors">
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="text-indigo-500 dark:text-indigo-200 font-medium">{crumb.label}</span>
                            )}
                            {i < crumbs.length - 1 && <ChevronRight size={12} aria-hidden="true" />}
                        </li>
                    ))}
                </ol>
            </nav>
        )}

        <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-indigo-800 dark:text-sand-100 tracking-tight">
                {title}
            </h1>
            {tifinagh && (
                <span className="tifinagh-text text-xl text-saffron-500" aria-hidden="true">
                    {tifinagh}
                </span>
            )}
        </div>

        {meta && (
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-400 dark:text-indigo-300 mt-2">
                {meta}
            </p>
        )}

        {description && (
            <p className="text-indigo-500 dark:text-indigo-200 mt-3 max-w-prose leading-relaxed">
                {description}
            </p>
        )}
    </header>
);

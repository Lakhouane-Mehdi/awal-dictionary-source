import { PageHeader } from '../../components/PageHeader';
import { usePageMeta } from '../../hooks/usePageMeta';
import { AUTHOR, PROJECT_ISSUES } from '../../utils/author';
import { GithubIcon } from '../../components/icons/GithubIcon';
import { Globe } from 'lucide-react';

export const Imprint = () => {
    usePageMeta(
        'Imprint',
        'Legal disclosure and operator information for the Awal Tamazight-English dictionary.',
        '/imprint'
    );

    return (
        <div className="animate-in fade-in duration-300">
            <PageHeader
                title="Imprint"
                description="Legal disclosure and operator information for this site."
                crumbs={[{ label: 'Home', to: '/' }, { label: 'Imprint' }]}
            />

            <section className="glass-panel p-6 mb-6">
                <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-400 dark:text-indigo-300 rule-accent mb-4">
                    Operator
                </h2>
                <p className="text-indigo-700 dark:text-indigo-100 leading-relaxed">
                    <strong className="text-indigo-800 dark:text-sand-100">{AUTHOR.name}</strong>
                    <br />
                    Awal — Tamazight-English Dictionary
                    <br />
                    An independent, non-commercial project.
                </p>
            </section>

            <section className="glass-panel p-6 mb-6">
                <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-400 dark:text-indigo-300 rule-accent mb-4">
                    Contact
                </h2>
                <p className="text-indigo-700 dark:text-indigo-100 leading-relaxed mb-4">
                    Enquiries, corrections, and takedown requests are handled through the
                    project's issue tracker.
                </p>
                <div className="flex flex-wrap gap-3">
                    <a
                        href={PROJECT_ISSUES}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-700/15 dark:border-white/15 text-sm font-semibold text-indigo-600 dark:text-indigo-200 hover:border-saffron-400 hover:text-saffron-600 transition-all"
                    >
                        <GithubIcon size={15} /> Open an issue
                    </a>
                    <a
                        href={AUTHOR.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-700/15 dark:border-white/15 text-sm font-semibold text-indigo-600 dark:text-indigo-200 hover:border-saffron-400 hover:text-saffron-600 transition-all"
                    >
                        <Globe size={15} /> {AUTHOR.websiteLabel}
                    </a>
                </div>
            </section>

            <section className="glass-panel p-6 mb-6">
                <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-400 dark:text-indigo-300 rule-accent mb-4">
                    Responsible for content
                </h2>
                <p className="text-indigo-700 dark:text-indigo-100 leading-relaxed">
                    {AUTHOR.name}, contactable via the channels above.
                </p>
            </section>

            <section className="glass-panel p-6 mb-6">
                <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-400 dark:text-indigo-300 rule-accent mb-4">
                    Liability for content
                </h2>
                <p className="text-indigo-700 dark:text-indigo-100 leading-relaxed mb-4">
                    Dictionary entries are compiled from the third-party linguistic sources
                    credited on the <a href="/about" className="text-saffron-600 dark:text-saffron-300 font-semibold hover:underline">About page</a>,
                    each under its own licence. Every effort is made to keep entries accurate,
                    but no warranty is given as to completeness or correctness. If you spot an
                    error, please report it.
                </p>
                <p className="text-indigo-700 dark:text-indigo-100 leading-relaxed">
                    This site links to external resources. Responsibility for the content of
                    linked pages lies with their respective operators.
                </p>
            </section>

            <section className="glass-panel p-6">
                <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-400 dark:text-indigo-300 rule-accent mb-4">
                    Dispute resolution
                </h2>
                <p className="text-indigo-700 dark:text-indigo-100 leading-relaxed">
                    The European Commission provides a platform for online dispute resolution:{' '}
                    <a
                        href="https://ec.europa.eu/consumers/odr/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-saffron-600 dark:text-saffron-300 font-semibold hover:underline break-all"
                    >
                        ec.europa.eu/consumers/odr
                    </a>
                    . We are not obliged to participate in dispute settlement proceedings before
                    a consumer arbitration board.
                </p>
            </section>
        </div>
    );
};

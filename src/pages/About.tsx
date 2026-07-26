import { Link } from 'react-router-dom';
import { Globe, Code2 } from 'lucide-react';
import { GithubIcon } from '../components/icons/GithubIcon';
import { AUTHOR, PROJECT_REPO, PROJECT_ISSUES } from '../utils/author';
import { PageHeader } from '../components/PageHeader';
import { usePageMeta } from '../hooks/usePageMeta';
import { totalEntries, categories, rootFamilies } from '../data/taxonomy';
import { proverbs } from '../data/proverbs';
import { tifinaghAlphabet } from '../data/tifinagh';

const SOURCES = [
    {
        name: 'Atlas Cultural Foundation',
        licence: null,
        text: 'Linguistic data adapted from the field work of the Atlas Cultural Foundation and their Tamazight English Dictionary of the Zaouiat Ahansal region.',
    },
    {
        name: 'Peace Corps Morocco',
        licence: null,
        text: 'Building upon the foundational linguistic research conducted by Peace Corps volunteers in Morocco.',
    },
    {
        name: 'IRCAM Verb Database',
        licence: 'Apache-2.0',
        text: 'Verb conjugation data from the Institut Royal de la Culture Amazighe (IRCAM).',
    },
    {
        name: 'Wiktionary',
        licence: 'CC-BY-SA 4.0',
        text: "Word definitions sourced from Wiktionary's Central Atlas Tamazight and Kabyle lemma categories.",
    },
    {
        name: 'Tatoeba',
        licence: 'CC-BY 2.0',
        text: 'Example sentences drawn from the Tatoeba corpus of Kabyle–English sentence pairs.',
    },
];

export const About = () => {
    usePageMeta(
        'About',
        `Awal is an offline Tamazight-English dictionary with ${totalEntries.toLocaleString()} entries across three scripts. Read about the project, its linguistic sources, and their licences.`,
        '/about'
    );

    const stats = [
        { label: 'Entries', value: totalEntries.toLocaleString() },
        { label: 'Categories', value: String(categories.length) },
        { label: 'Root families', value: String(rootFamilies.length) },
        { label: 'Proverbs', value: String(proverbs.length) },
        { label: 'Tifinagh letters', value: String(tifinaghAlphabet.length) },
        { label: 'Scripts', value: '3' },
    ];

    return (
        <div className="animate-in fade-in duration-300">
            <PageHeader
                title="About Awal"
                tifinagh="ⴰⵡⴰⵍ"
                description="Awal means “word” in Tamazight. This project preserves and opens up the Amazigh language through a modern, offline-first dictionary — free to use, and built on the work of the linguists and volunteers credited below."
                crumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]}
            />

            {/* Corpus at a glance */}
            <section className="glass-panel p-6 mb-6">
                <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-400 dark:text-indigo-300 rule-accent mb-5">
                    The dictionary at a glance
                </h2>
                <dl className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                    {stats.map(stat => (
                        <div key={stat.label}>
                            <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-400 dark:text-indigo-300">
                                {stat.label}
                            </dt>
                            <dd className="font-display text-2xl font-bold text-indigo-700 dark:text-sand-100 mt-0.5">
                                {stat.value}
                            </dd>
                        </div>
                    ))}
                </dl>
            </section>

            {/* Scripts */}
            <section className="glass-panel p-6 mb-6">
                <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-400 dark:text-indigo-300 rule-accent mb-5">
                    Three scripts, one language
                </h2>
                <p className="text-indigo-700 dark:text-indigo-100 leading-relaxed mb-5">
                    Tamazight is written in three systems today. Awal shows all of them and lets
                    you switch at any time using the eye icon.
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                    {[
                        { name: 'Tifinagh', sample: 'ⴰⵣⵓⵍ', note: 'The indigenous Amazigh script, standardised by IRCAM.' },
                        { name: 'Latin', sample: 'Azul', note: 'The transcription used in most academic work.' },
                        { name: 'Arabic', sample: 'أزول', note: 'Widely used across North Africa.' },
                    ].map(s => (
                        <div key={s.name} className="border border-indigo-700/10 dark:border-white/10 rounded-xl p-4">
                            <p className={`text-2xl text-indigo-800 dark:text-sand-100 mb-2 ${s.name === 'Tifinagh' ? 'tifinagh-text' : ''}`}>
                                {s.sample}
                            </p>
                            <p className="font-semibold text-sm text-indigo-700 dark:text-sand-100">{s.name}</p>
                            <p className="text-xs text-indigo-400 dark:text-indigo-300 mt-1 leading-relaxed">{s.note}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Sources */}
            <section className="glass-panel p-6 mb-6">
                <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-400 dark:text-indigo-300 rule-accent mb-5">
                    Sources & acknowledgements
                </h2>
                <div className="space-y-4">
                    {SOURCES.map(source => (
                        <div key={source.name} className="border-l-2 border-saffron-400 pl-4">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h3 className="font-semibold text-indigo-800 dark:text-sand-100">{source.name}</h3>
                                {source.licence && (
                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-white/10 text-indigo-600 dark:text-indigo-200">
                                        {source.licence}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-indigo-500 dark:text-indigo-200 leading-relaxed">{source.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contribute */}
            <section className="glass-panel p-6 mb-6">
                <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-400 dark:text-indigo-300 rule-accent mb-4">
                    Contribute
                </h2>
                <p className="text-indigo-700 dark:text-indigo-100 leading-relaxed mb-5">
                    A dictionary is never finished. If a word is missing, wrong, or differs in your
                    dialect, corrections are welcome.
                </p>
                <div className="flex flex-wrap gap-3">
                    <a
                        href={PROJECT_ISSUES}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all active:scale-[0.98]"
                    >
                        <GithubIcon size={16} /> Suggest a word on GitHub
                    </a>
                    <Link
                        to="/tools/community"
                        className="inline-flex items-center gap-2 border border-indigo-700/15 dark:border-white/15 text-indigo-600 dark:text-indigo-200 font-semibold py-2.5 px-5 rounded-xl hover:border-saffron-400 hover:text-saffron-600 transition-all"
                    >
                        Community page
                    </Link>
                </div>
            </section>

            {/* Author */}
            <section className="glass-panel p-6 mb-6">
                <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-400 dark:text-indigo-300 rule-accent mb-4">
                    Who made this
                </h2>
                <p className="font-display text-xl font-bold text-indigo-800 dark:text-sand-100">
                    {AUTHOR.name}
                </p>
                <p className="text-sm text-indigo-500 dark:text-indigo-200 mt-1 mb-4 leading-relaxed">
                    Awal is designed, built, and maintained as an independent project.
                </p>
                <div className="flex flex-wrap gap-3">
                    <a
                        href={AUTHOR.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-700/15 dark:border-white/15 text-sm font-semibold text-indigo-600 dark:text-indigo-200 hover:border-saffron-400 hover:text-saffron-600 transition-all"
                    >
                        <Globe size={15} /> {AUTHOR.websiteLabel}
                    </a>
                    <a
                        href={AUTHOR.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-700/15 dark:border-white/15 text-sm font-semibold text-indigo-600 dark:text-indigo-200 hover:border-saffron-400 hover:text-saffron-600 transition-all"
                    >
                        <GithubIcon size={15} /> {AUTHOR.githubLabel}
                    </a>
                    <a
                        href={PROJECT_REPO}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-700/15 dark:border-white/15 text-sm font-semibold text-indigo-600 dark:text-indigo-200 hover:border-saffron-400 hover:text-saffron-600 transition-all"
                    >
                        <Code2 size={15} /> Project source
                    </a>
                </div>
            </section>

            {/* Legal */}
            <section className="text-center py-6">
                <p className="text-xs text-indigo-400 dark:text-indigo-300 leading-relaxed">
                    Version 0.1.0
                    <br />
                    © {new Date().getFullYear()} Awal Project. All rights reserved.
                </p>
                <div className="flex justify-center gap-4 mt-3 text-xs">
                    <Link to="/privacy" className="text-indigo-400 dark:text-indigo-300 hover:text-saffron-600 transition-colors">
                        Privacy
                    </Link>
                    <Link to="/imprint" className="text-indigo-400 dark:text-indigo-300 hover:text-saffron-600 transition-colors">
                        Imprint
                    </Link>
                </div>
            </section>
        </div>
    );
};

import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { usePageMeta } from '../hooks/usePageMeta';
import { proverbs } from '../data/proverbs';

export const Proverbs = () => {
    usePageMeta(
        'Amazigh proverbs',
        `${proverbs.length} traditional Amazigh proverbs (inzan) with Tifinagh, Latin transcription, English translation, and the meaning behind each saying.`,
        '/proverbs'
    );

    return (
        <div className="animate-in fade-in duration-300">
            <PageHeader
                title="Proverbs"
                tifinagh="ⵉⵏⵣⴰⵏ"
                meta={`${proverbs.length} sayings`}
                description="Inzan are the condensed wisdom of Amazigh oral tradition — short sayings that carry lessons across generations."
                crumbs={[{ label: 'Home', to: '/' }, { label: 'Proverbs' }]}
            />

            <div className="grid gap-4 sm:grid-cols-2">
                {proverbs.map(proverb => (
                    <Link
                        key={proverb.id}
                        to={`/proverb/${proverb.id}`}
                        className="glass-panel p-6 group hover:shadow-panel-lg transition-all flex flex-col"
                    >
                        <p className="tifinagh-text text-xl text-indigo-800 dark:text-sand-100 leading-relaxed mb-3">
                            {proverb.text_tifinagh}
                        </p>
                        <p className="font-display italic text-indigo-500 dark:text-indigo-200 mb-3">
                            "{proverb.text_latin}"
                        </p>
                        <p className="text-indigo-700 dark:text-indigo-100 font-medium mt-auto group-hover:text-saffron-600 dark:group-hover:text-saffron-300 transition-colors">
                            {proverb.translation}
                        </p>
                        {proverb.region && (
                            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-400 dark:text-indigo-300 mt-3">
                                {proverb.region}
                            </span>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
};

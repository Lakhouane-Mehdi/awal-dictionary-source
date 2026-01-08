import clsx from 'clsx';
import { motion } from 'framer-motion';

type Dialect = 'all' | 'tarifit' | 'kabyle' | 'tashelhit';

interface DialectToggleProps {
    current: Dialect;
    onChange: (d: Dialect) => void;
}

const dialects: { id: Dialect; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'tarifit', label: 'Tarifit' },
    { id: 'kabyle', label: 'Kabyle' },
    { id: 'tashelhit', label: 'Tashelhit' },
];

export const DialectToggle = ({ current, onChange }: DialectToggleProps) => {
    return (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide px-1">
            {dialects.map((d) => {
                const isActive = current === d.id;
                return (
                    <button
                        key={d.id}
                        onClick={() => onChange(d.id)}
                        className={clsx(
                            'relative px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap z-0',
                            isActive ? 'text-white shadow-lg shadow-blue-500/30' : 'text-slate-500 hover:bg-white/40 hover:text-slate-700'
                        )}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="dialect-pill"
                                className="absolute inset-0 bg-blue-600 rounded-full -z-10"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        {d.label}
                    </button>
                )
            })}
        </div>
    );
};

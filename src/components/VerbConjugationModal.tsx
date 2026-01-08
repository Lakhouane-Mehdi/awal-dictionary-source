import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { convertScript } from '../utils/scriptConverter';

interface ConjugationData {
    preterite: string;
    intensive: string;
    future: string;
    aorist?: string;
}

interface VerbConjugationModalProps {
    isOpen: boolean;
    onClose: () => void;
    verbName: string;
    conjugation: ConjugationData;
    script: 'latin' | 'tifinagh' | 'arabic';
}

export const VerbConjugationModal = ({ isOpen, onClose, verbName, conjugation, script }: VerbConjugationModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    >
                        {/* Modal Container */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden relative"
                        >
                            {/* Header */}
                            <div className="p-6 pb-2 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Sparkles size={14} className="text-purple-500" />
                                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Verb Conjugation</span>
                                        </div>
                                        <h2 className={`text-3xl font-black text-slate-800 dark:text-white ${script === 'tifinagh' ? 'tifinagh-text' : ''}`}>
                                            {convertScript(verbName, script)}
                                        </h2>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-red-500"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                <AspectRow label="Preterite (Past)" value={conjugation.preterite} script={script} color="blue" />
                                <AspectRow label="Intensive (Habitual)" value={conjugation.intensive} script={script} color="purple" />
                                <AspectRow label="Future" value={conjugation.future} script={script} color="pink" />
                                {conjugation.aorist && (
                                    <AspectRow label="Aorist (Imperative)" value={conjugation.aorist} script={script} color="orange" />
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

const AspectRow = ({ label, value, script, color }: { label: string, value: string, script: string, color: string }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200 border-blue-200 dark:border-blue-700/50',
        purple: 'bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200 border-purple-200 dark:border-purple-700/50',
        pink: 'bg-pink-50 text-pink-700 dark:bg-pink-900/40 dark:text-pink-200 border-pink-200 dark:border-pink-700/50',
        orange: 'bg-orange-50 text-orange-700 dark:bg-orange-900/40 dark:text-orange-200 border-orange-200 dark:border-orange-700/50',
    };

    const selectedColor = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

    return (
        <div className="flex items-center gap-4">
            <div className="w-1/3 text-right">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block">{label}</span>
            </div>
            <div className={`flex-1 p-3 rounded-xl border ${selectedColor} font-bold text-lg ${script === 'tifinagh' ? 'tifinagh-text' : ''}`}>
                {convertScript(value, script as 'latin' | 'tifinagh' | 'arabic')}
            </div>
        </div>
    );
};

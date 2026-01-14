// React imports removed as they were unused
import { motion, AnimatePresence } from 'framer-motion';
import { X, Network, Sprout, ArrowRight } from 'lucide-react';
import type { DictionaryEntry } from '../data/dictionary';

interface RootModalProps {
    isOpen: boolean;
    onClose: () => void;
    entry: DictionaryEntry;
    relatedEntries: DictionaryEntry[];
}

export const RootExplorerModal = ({ isOpen, onClose, entry, relatedEntries }: RootModalProps) => {
    if (!entry.root) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.95, y: 10, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-950 rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 dark:border-emerald-900/30"
                    >
                        {/* Header */}
                        <div className="bg-emerald-600 dark:bg-emerald-900 p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Network size={150} className="text-white" />
                            </div>

                            <div className="relative z-10">
                                <span className="inline-flex items-center gap-2 bg-black/20 text-white/90 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 backdrop-blur-sm">
                                    <Sprout size={12} /> Linguistic Root
                                </span>
                                <h2 className="text-4xl font-black text-white mb-1 tracking-tight">Root: {entry.root}</h2>
                                <p className="text-emerald-100 font-medium text-sm">The DNA of the word</p>
                            </div>

                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/30 text-white rounded-full transition-colors z-20"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Etymology Section */}
                            <div className="mb-8">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Origin & Meaning</h3>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                    {entry.etymology}
                                </p>
                            </div>

                            {/* Related Words */}
                            {relatedEntries.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                        <Network size={14} /> Related Words
                                    </h3>
                                    <div className="grid gap-3">
                                        {relatedEntries.map((related) => (
                                            <div key={related.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xs tifinagh-text">
                                                        {related.term_tifinagh.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 dark:text-slate-200">{related.term_latin}</p>
                                                        <p className="text-xs text-slate-500">{related.definition}</p>
                                                    </div>
                                                </div>
                                                <div className="text-slate-300 dark:text-slate-600">
                                                    <ArrowRight size={16} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {relatedEntries.length === 0 && (
                                <p className="text-sm text-slate-400 italic text-center py-4">
                                    More related words coming soon to the dictionary.
                                </p>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

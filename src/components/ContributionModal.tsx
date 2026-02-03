import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, PenLine, PlusCircle, MessageSquare } from 'lucide-react';
import { useContribution, type ContributionData } from '../hooks/useContribution';

interface ContributionModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialTerm?: string;
}

export const ContributionModal = ({ isOpen, onClose, initialTerm = '' }: ContributionModalProps) => {
    const { submitContribution, loading } = useContribution();
    const [type, setType] = useState<'correction' | 'new'>('new');
    const [formData, setFormData] = useState<Partial<ContributionData>>({
        term: initialTerm,
        definition: '',
        notes: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.term || !formData.definition) return;

        submitContribution({
            type,
            term: formData.term,
            definition: formData.definition,
            notes: formData.notes
        } as ContributionData);

        // Close after a slight delay to allow the mailto to trigger
        setTimeout(onClose, 1000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <PenLine className="text-blue-500" size={24} />
                                Suggest Edit
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Type Selection */}
                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
                                <button
                                    type="button"
                                    onClick={() => setType('new')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${type === 'new' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <PlusCircle size={16} /> New Word
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType('correction')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${type === 'correction' ? 'bg-white dark:bg-slate-700 shadow-sm text-orange-600 dark:text-orange-400' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <MessageSquare size={16} /> Correction
                                </button>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Term (Latin or Tifinagh)</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.term}
                                    onChange={e => setFormData({ ...formData, term: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 font-bold text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="e.g. Agrou"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Definition (English)</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.definition}
                                    onChange={e => setFormData({ ...formData, definition: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                                    placeholder="e.g. Frog"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Notes (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="Source, region, etc."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
                            >
                                {loading ? 'Opening Mail...' : <>Submit via Email <Send size={18} /></>}
                            </button>

                            <p className="text-center text-[10px] text-slate-400 mt-2">
                                Submissions are reviewed manually. Thank you for contributing!
                            </p>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

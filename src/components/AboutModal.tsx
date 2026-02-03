import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, ScrollText, Users, Mail } from 'lucide-react';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
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
                        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/moroccan-flower.png')]"></div>

                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/30 text-white rounded-full transition-colors z-20"
                            >
                                <X size={20} />
                            </button>

                            <ShieldCheck size={48} className="text-white mx-auto mb-4 opacity-90" />
                            <h2 className="text-3xl font-black text-white tracking-tight mb-1">Awal Dictionary</h2>
                            <p className="text-blue-100 font-medium">Version 0.1.0 (Beta)</p>
                        </div>

                        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">

                            {/* Mission */}
                            <div className="text-center">
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">
                                    "Preserving the rich linguistic heritage of the Amazigh people through modern technology."
                                </p>
                            </div>

                            <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

                            {/* Credits */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                    <ScrollText size={14} /> Sources & Acknowledgements
                                </h3>
                                <div className="space-y-4">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Atlas Cultural Foundation</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Linguistic data adapted from the field work of the Atlas Cultural Foundation and their Dictionary of the Zaouiat Ahansal region.
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Peace Corps</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Building upon the foundational linguistic research conducted by Peace Corps volunteers in Morocco.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Developer */}
                            <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                        <Users size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Produced By</p>
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Mehdi Lakhouane</p>
                                    </div>
                                </div>
                            </div>

                            <a
                                href="mailto:mehdi@awaldictionary.com?subject=New Word Suggestion&body=I would like to suggest a new word for the dictionary:"
                                className="flex items-center justify-center gap-2 w-full p-4 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 rounded-xl font-bold hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                            >
                                <Mail size={18} />
                                Suggest a Missing Word
                            </a>

                            <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

                            {/* Legal */}
                            <div className="text-center space-y-2">
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                                    Legal Notice
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    This software is <strong className="text-slate-700 dark:text-slate-300">Strictly Proprietary</strong>.
                                    <br />
                                    Unauthorized copying, distribution, or reverse engineering is prohibited.
                                </p>
                                <p className="text-[10px] text-slate-300 dark:text-slate-600 pt-2">
                                    © {new Date().getFullYear()} Awal Project. All Rights Reserved.
                                </p>
                            </div>

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

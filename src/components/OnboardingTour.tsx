import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, Sparkles } from 'lucide-react';
import { readString, writeString } from '../utils/storage';

interface TourStep {
    targetId?: string;
    title: string;
    description: string;
    position?: 'bottom' | 'top' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
    {
        title: "Azul! ⴰⵣⵓⵍ! Welcome to Awal",
        description: "Your modern gateway to the Amazigh language. Let's take a quick tour of the unique features we've built for you.",
        targetId: undefined
    },
    {
        targetId: 'tour-script-toggle',
        title: "The Magic Eye",
        description: "Tap this to instantly switch the entire app between Latin (ABC), Tifinagh (ⴰⴱⵛ), and Arabic (أ ب ت) scripts.",
        position: 'bottom'
    },
    {
        targetId: 'tour-achievements',
        title: "Your Journey",
        description: "Track your learning streaks, quizzes, and unlock badges as you explore the dictionary.",
        position: 'bottom'
    },
    {
        targetId: 'tour-contribute',
        title: "Contribute",
        description: "Found a missing word? Use this button to suggest edits or add new terms to the community.",
        position: 'left'
    }
];

const SEEN_KEY = 'awal_has_seen_onboarding';

const hasSeenTour = (): boolean => !!readString(SEEN_KEY);

/** A step points at a control; skip it when that control is not on screen. */
const isOnScreen = (targetId?: string): boolean => {
    if (!targetId) return true;
    const rect = document.getElementById(targetId)?.getBoundingClientRect();
    return !!rect && rect.width > 0 && rect.height > 0;
};

export const OnboardingTour = () => {
    const [stepIndex, setStepIndex] = useState(0);
    const [steps, setSteps] = useState<TourStep[] | null>(null);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        if (hasSeenTour()) return undefined;
        // Pick the steps once the page has rendered: the Contribute button only
        // exists on phones and the header controls only on some layouts
        const timer = setTimeout(() => setSteps(TOUR_STEPS.filter(step => isOnScreen(step.targetId))), 1500);
        return () => clearTimeout(timer);
    }, []);

    const currentStep = steps?.[stepIndex] ?? TOUR_STEPS[0];

    useEffect(() => {
        if (steps) {
            const updateRect = () => {
                const targetId = steps[stepIndex]?.targetId;
                // Clear the spotlight when the target is gone, rather than
                // leaving it on the previous step's control
                setTargetRect(targetId ? document.getElementById(targetId)?.getBoundingClientRect() ?? null : null);
            };

            updateRect();
            window.addEventListener('resize', updateRect);

            return () => window.removeEventListener('resize', updateRect);
        }

        setTargetRect(null);
        return () => { };
    }, [stepIndex, steps]);

    const handleNext = () => {
        if (steps && stepIndex < steps.length - 1) {
            setStepIndex((prev) => prev + 1);
            return;
        }
        handleClose();
    };

    const handleClose = () => {
        setSteps(null);
        writeString(SEEN_KEY, 'true');
    };

    if (!steps) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[999] pointer-events-none">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/70 pointer-events-auto"
                    onClick={handleClose}
                />

                {targetRect && (
                    <motion.div
                        layoutId="spotlight"
                        className="absolute rounded-full border-4 border-white/50 shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] pointer-events-none transition-all duration-500 ease-out"
                        style={{
                            left: targetRect.left - 8,
                            top: targetRect.top - 8,
                            width: targetRect.width + 16,
                            height: targetRect.height + 16,
                        }}
                    />
                )}

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                        key={stepIndex}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            ...(targetRect ? {
                                position: 'absolute',
                                // Clamp left position to ensure tooltip stays within viewport
                                left: (() => {
                                    // Default centered position
                                    let leftPos = (targetRect.left + targetRect.width / 2) - 160;

                                    // Override for specific sides
                                    if (currentStep.position === 'left') leftPos = targetRect.left - 320;
                                    if (currentStep.position === 'right') leftPos = targetRect.right + 20;

                                    // Safety clamp (20px padding)
                                    const maxLeft = window.innerWidth - 320;
                                    const minLeft = 20;
                                    return Math.min(maxLeft, Math.max(minLeft, leftPos));
                                })(),
                                top: currentStep.position === 'top' ? targetRect.top - 180 :
                                    currentStep.position === 'bottom' ? targetRect.bottom + 20 :
                                        targetRect.top
                            } : {
                                position: 'relative'
                            })
                        }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="pointer-events-auto bg-white dark:bg-slate-900 w-[300px] p-6 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-accent-50 dark:bg-accent-900/30 rounded-full text-accent-600 dark:text-accent-300">
                                <Sparkles size={20} />
                            </div>
                            <button type="button" onClick={handleClose} aria-label="Close the tour" className="text-slate-400 hover:text-slate-600">
                                <X size={18} />
                            </button>
                        </div>

                        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-2">
                            {currentStep.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                            {currentStep.description}
                        </p>

                        <div className="flex items-center justify-between">
                            <div className="flex gap-1">
                                {steps.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 rounded-full transition-all ${i === stepIndex ? 'w-6 bg-accent-500' : 'w-1.5 bg-slate-200 dark:bg-slate-700'}`}
                                    />
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={handleNext}
                                className="flex items-center gap-1 text-sm font-bold text-accent-700 hover:text-accent-800 dark:text-accent-300 transition-colors"
                            >
                                {stepIndex === steps.length - 1 ? "Finish" : "Next"} <ChevronRight size={16} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    );
};

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, Sparkles } from 'lucide-react';

interface TourStep {
    targetId?: string;
    title: string;
    description: string;
    position?: 'bottom' | 'top' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
    {
        title: "Welcome to Awal! Azul! ♓",
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

export const OnboardingTour = () => {
    const [stepIndex, setStepIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        const hasSeen = localStorage.getItem('awal_has_seen_onboarding');
        if (!hasSeen) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
        return () => { };
    }, []);

    const currentStep = TOUR_STEPS[stepIndex];

    useEffect(() => {
        if (isVisible) {
            const updateRect = () => {
                const step = TOUR_STEPS[stepIndex];
                const targetId = step.targetId;

                if (targetId) {
                    const el = document.getElementById(targetId);
                    if (el) {
                        setTargetRect(el.getBoundingClientRect());
                    }
                } else {
                    setTargetRect(null);
                }
            };

            updateRect();
            window.addEventListener('resize', updateRect);

            return () => window.removeEventListener('resize', updateRect);
        }

        setTargetRect(null);
        return () => { };
    }, [stepIndex, isVisible]);

    const handleNext = () => {
        if (stepIndex < TOUR_STEPS.length - 1) {
            setStepIndex((prev) => prev + 1);
            return;
        }
        handleClose();
    };

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem('awal_has_seen_onboarding', 'true');
    };

    if (!isVisible) return null;

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
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                                <Sparkles size={20} />
                            </div>
                            <button onClick={handleClose} className="text-slate-400 hover:text-slate-600">
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
                                {TOUR_STEPS.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 rounded-full transition-all ${i === stepIndex ? 'w-6 bg-blue-500' : 'w-1.5 bg-slate-200 dark:bg-slate-700'}`}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                {stepIndex === TOUR_STEPS.length - 1 ? "Finish" : "Next"} <ChevronRight size={16} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    );
};

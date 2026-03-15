import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Trophy, Star, Loader2, Type } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuiz } from '../hooks/useQuiz';
import { useGamification } from '../hooks/useGamification';

export const Quiz = () => {
    const navigate = useNavigate();
    const { questions, loading, generateQuestions } = useQuiz(5);
    const { completeDailyTask, trackAction } = useGamification();

    // Game State
    // Game State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    // No useEffect for reset - manual control is safer
    const resetState = () => {
        setCurrentIndex(0);
        setScore(0);
        setShowScore(false);
        setSelectedOption(null);
        setIsAnswered(false);
    };

    const handleAnswer = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);
        setIsAnswered(true);

        if (index === questions[currentIndex].correct) {
            setScore(score + 1);
        }

        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setSelectedOption(null);
                setIsAnswered(false);
            } else {
                setShowScore(true);
                trackAction('QUIZ'); // Track completion
                if (score > 0 || index === questions[currentIndex].correct) {
                    completeDailyTask();
                }
            }
        }, 1500);
    };

    const restart = () => {
        // Reset local state
        resetState();
        // Generate new questions
        generateQuestions();
    };

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Loader2 size={48} className="text-blue-500 animate-spin" />
            </div>
        );
    }

    if (questions.length === 0) return null;

    const currentQ = questions[currentIndex];

    return (
        <div className="p-4 w-full h-full flex flex-col">
            <header className="mb-6 mt-2 flex items-center gap-3 relative z-10">
                <button onClick={() => navigate('/tools')} className="p-2 bg-white/50 hover:bg-white rounded-full transition-all text-slate-700 shadow-sm">
                    <ArrowLeft size={24} />
                </button>
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                        <h1 className="text-xl font-bold text-slate-800">Daily Quiz</h1>
                        <span className="text-xs font-bold text-slate-500">Q{currentIndex + 1}/{questions.length}</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 bg-white/30 mt-1 rounded-full overflow-hidden shadow-inner backdrop-blur-sm">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100}%` }}
                            transition={{ ease: "easeOut", duration: 0.5 }}
                        />
                    </div>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {showScore ? (
                    <motion.div
                        key="score"
                        initial={{ opacity: 0, scale: 0.9, rotateX: -20 }}
                        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                        className="glass-panel p-8 text-center flex-1 flex flex-col items-center justify-center rounded-3xl relative overflow-hidden"
                    >
                        {/* Confetti / Burst Background */}
                        <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay" />

                        <div className="relative z-10">
                            <motion.div
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.2 }}
                                className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-yellow-200"
                            >
                                <Trophy size={48} className="text-yellow-500 drop-shadow-sm" fill="currentColor" />
                            </motion.div>

                            <h2 className="text-3xl font-black text-slate-800 mb-2">Quiz Complete!</h2>
                            <p className="text-slate-500 font-medium mb-8">You mastered this session</p>

                            <div className="flex justify-center gap-2 mb-8">
                                {[...Array(questions.length)].map((_, i) => (
                                    <Star key={i} size={32} className={`${i < score ? 'text-yellow-400 fill-current' : 'text-slate-200'} transition-colors`} />
                                ))}
                            </div>

                            <div className="text-5xl font-black text-blue-600 mb-8 tracking-tighter shadow-blue-200 drop-shadow-lg">{score} / {questions.length}</div>

                            <button onClick={restart} className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 transition-all active:scale-95">
                                Play Again
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key={currentQ.id} // Use question ID for key to trigger animation
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="flex-1 flex flex-col"
                    >
                        <div className="glass-panel p-8 mb-8 min-h-[180px] flex flex-col items-center justify-center text-center rounded-3xl border-2 border-white/60 shadow-xl shadow-blue-900/5">
                            {currentQ.type === 'tifinagh' && (
                                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-3 flex items-center gap-1">
                                    <Type size={12} /> Tifinagh Recognition
                                </span>
                            )}
                            <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 leading-tight">{currentQ.question}</h2>
                        </div>

                        <div className="space-y-4">
                            {currentQ.options.map((option, index) => {
                                const isSelected = selectedOption === index;
                                const isCorrect = index === currentQ.correct;
                                const isTifinaghOption = currentQ.type === 'tifinagh';

                                let stateClasses = 'bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-700 border-white/40 hover:border-blue-300 text-slate-700 dark:text-slate-200';
                                if (isAnswered) {
                                    if (isCorrect) stateClasses = 'bg-green-100 dark:bg-green-900/40 border-green-500 text-green-800 dark:text-green-300 ring-2 ring-green-200';
                                    else if (isSelected) stateClasses = 'bg-red-50 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-300 ring-2 ring-red-100';
                                    else stateClasses = 'bg-slate-50 dark:bg-slate-800/30 opacity-50';
                                } else if (isSelected) {
                                    stateClasses = 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-800 dark:text-blue-300';
                                }

                                return (
                                    <motion.button
                                        key={index}
                                        whileHover={!isAnswered ? { scale: 1.02 } : {}}
                                        whileTap={!isAnswered ? { scale: 0.98 } : {}}
                                        onClick={() => handleAnswer(index)}
                                        disabled={isAnswered}
                                        className={`w-full p-5 rounded-2xl border-2 text-left font-bold text-lg transition-all flex justify-between items-center shadow-sm ${stateClasses} ${isTifinaghOption ? 'tifinagh-text' : ''}`}
                                    >
                                        {option}
                                        {isAnswered && isCorrect && <CheckCircle size={24} className="text-green-600" fill="currentColor" />}
                                        {isAnswered && isSelected && !isCorrect && <XCircle size={24} className="text-red-600" fill="currentColor" />}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

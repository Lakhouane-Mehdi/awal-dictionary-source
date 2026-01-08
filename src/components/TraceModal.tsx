import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eraser, Check } from 'lucide-react';

interface TraceModalProps {
    isOpen: boolean;
    onClose: () => void;
    character: string; // The Tifinagh character to trace
}

export const TraceModal = ({ isOpen, onClose, character }: TraceModalProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);

    // Initialize Canvas
    useEffect(() => {
        if (isOpen && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Set canvas size to match display size
                const rect = canvas.getBoundingClientRect();
                canvas.width = rect.width;
                canvas.height = rect.height;

                // Style
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.lineWidth = 12; // Thick brush
                ctx.strokeStyle = '#3b82f6'; // Blue-500

                // Clear any previous state
                setHasDrawn(false);
            }
        }
    }, [isOpen]);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        draw(e);
        setHasDrawn(true);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) ctx.beginPath(); // Reset path so next line is separate
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const rect = canvas.getBoundingClientRect();
        let x, y;

        if ('touches' in e) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = (e as React.MouseEvent).clientX - rect.left;
            y = (e as React.MouseEvent).clientY - rect.top;
        }

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setHasDrawn(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-sm aspect-square bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-4 border-white dark:border-slate-800 overflow-hidden"
                    >
                        {/* Background Guide Character */}
                        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
                            <span className="text-[200px] leading-none text-slate-200 dark:text-slate-800 font-bold tifinagh-text opacity-50">
                                {character}
                            </span>
                        </div>

                        {/* Drawing Canvas */}
                        <canvas
                            ref={canvasRef}
                            onMouseDown={startDrawing}
                            onMouseUp={stopDrawing}
                            onMouseMove={draw}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchEnd={stopDrawing}
                            onTouchMove={draw}
                            className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                        />

                        {/* Controls Overlay */}
                        <div className="absolute bottom-6 left-0 w-full flex justify-center gap-4 px-6 pointer-events-none">
                            <button
                                onClick={onClose}
                                className="pointer-events-auto flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 shadow-lg transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <button
                                onClick={clearCanvas}
                                className="pointer-events-auto flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white shadow-xl shadow-blue-500/30 hover:scale-110 active:scale-95 transition-all"
                            >
                                <Eraser size={24} />
                            </button>

                            {hasDrawn && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="pointer-events-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white shadow-lg"
                                >
                                    <Check size={24} strokeWidth={3} />
                                </motion.div>
                            )}
                        </div>

                        {/* Instruction Label */}
                        <div className="absolute top-6 w-full text-center pointer-events-none">
                            <span className="bg-slate-900/50 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                                Trace the Character
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

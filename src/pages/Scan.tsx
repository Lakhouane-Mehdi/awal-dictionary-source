import { useState, useRef, useEffect } from 'react';
import { RefreshCw, ArrowLeft, ScanLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Tesseract from 'tesseract.js';
import { motion } from 'framer-motion';
import { useSearch } from '../hooks/useSearch';
import { WordCard } from '../components/WordCard';
import { useScript } from '../context/ScriptContext';
import type { DictionaryEntry } from '../data/dictionary';

export const CalculatorOCR = () => {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [cameraActive, setCameraActive] = useState(true);

    // Search Integration
    const { setQuery, results } = useSearch();
    const { script } = useScript(); // For WordCard display
    const [bestMatch, setBestMatch] = useState<DictionaryEntry | null>(null);

    // When results change AND we have a scan result, update best match
    useEffect(() => {
        if (result && results.length > 0) {
            setBestMatch(results[0]);
        } else {
            setBestMatch(null);
        }
    }, [result, results]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera error:", err);
            setResult("Camera access denied. Please ensure you are on HTTPS or localhost.");
        }
    };

    useEffect(() => {
        if (cameraActive) startCamera();
        const videoEl = videoRef.current;

        return () => {
            if (videoEl && videoEl.srcObject) {
                const stream = videoEl.srcObject as MediaStream;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, [cameraActive]);

    const captureAndScan = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        setIsScanning(true);
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

        try {
            const worker = await Tesseract.createWorker('eng');
            const { data: { text } } = await worker.recognize(canvas);
            await worker.terminate();

            const cleanedText = text.trim();
            setResult(cleanedText || "No text detected.");

            if (cleanedText) {
                // Trigger search
                setQuery(cleanedText);
            }
        } catch {
            setResult("Error scanning text.");
        } finally {
            setIsScanning(false);
            setCameraActive(false);
        }
    };

    const reset = () => {
        setResult(null);
        setCameraActive(true);
        // Restart camera
        startCamera().catch(() => setResult('Could not restart camera.'));
    };

    return (
        <div className="h-screen bg-black text-white flex flex-col relative overflow-hidden font-sans">
            {/* Dark Gradient Overlay for video text readability */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between z-20 items-center">
                <button onClick={() => navigate('/tools')} className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                    <ScanLine size={18} className="text-blue-400" />
                    <span className="font-bold text-sm tracking-wide">AI VISUAL TRANSLATOR</span>
                </div>
                <div className="w-10"></div>
            </div>

            {/* Camera Feed */}
            {cameraActive && (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
            )}
            <canvas ref={canvasRef} className="hidden" />

            {/* Scanner UI Overlay */}
            {cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                    <div className="relative w-72 h-48">
                        {/* Scanning Animation Line */}
                        <motion.div
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10"
                        />

                        {/* Corners */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white/80 rounded-tl-lg" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white/80 rounded-tr-lg" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white/80 rounded-bl-lg" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white/80 rounded-br-lg" />
                    </div>
                    <p className="mt-8 text-white/80 text-sm font-medium tracking-wider bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">align text inside frame</p>
                </div>
            )}

            {/* Result Modal */}
            {/* Result Modal */}
            {!cameraActive && result && (
                <div className="absolute inset-0 z-30 flex flex-col justify-end sm:justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="w-full max-w-md mx-auto flex flex-col gap-4"
                    >
                        {/* OCR Text Debug/Confirmation */}
                        <div className="bg-white/10 rounded-xl p-3 border border-white/10 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase text-white/50 tracking-wider font-bold">Scanned Text</span>
                                <span className="font-mono text-sm text-white/90 truncate max-w-[200px]">{result}</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={reset}
                                    className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                                >
                                    <RefreshCw size={16} />
                                </button>
                            </div>
                        </div>

                        {bestMatch ? (
                            <div className="relative">
                                <span className="absolute -top-3 left-4 z-10 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                                    BEST MATCH FOUND
                                </span>
                                <WordCard
                                    entry={bestMatch}
                                    dialect="all"
                                    script={script}
                                    onConjugate={() => { }}
                                    onTrace={() => { }}
                                    onRoot={() => { }}
                                />
                            </div>
                        ) : (
                            <div className="bg-white text-slate-900 rounded-3xl p-6 shadow-2xl text-center">
                                <p className="text-slate-500 mb-4">No dictionary match found for "{result}".</p>
                                <button
                                    onClick={reset}
                                    className="w-full py-3 bg-blue-100 text-blue-700 rounded-xl font-bold hover:bg-blue-200 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}

                        {/* Space at bottom for scrolling */}
                        <div className="h-4"></div>
                    </motion.div>
                </div>
            )}

            {/* Shutter Button */}
            {cameraActive && (
                <div className="absolute bottom-0 left-0 right-0 py-10 flex justify-center z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                    <button
                        onClick={captureAndScan}
                        disabled={isScanning}
                        className="group relative"
                    >
                        <div className={`w-20 h-20 rounded-full border-4 border-white/80 flex items-center justify-center transition-transform ${isScanning ? 'scale-95' : 'group-active:scale-90'}`}>
                            <div className={`w-16 h-16 bg-white rounded-full transition-all duration-300 ${isScanning ? 'scale-75 animate-pulse bg-blue-500' : ''}`} />
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};

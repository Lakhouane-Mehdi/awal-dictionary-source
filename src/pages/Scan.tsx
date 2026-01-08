import { useState, useRef, useEffect } from 'react';
import { RefreshCw, ArrowLeft, ScanLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Tesseract from 'tesseract.js';
import { motion } from 'framer-motion';

export const CalculatorOCR = () => {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [cameraActive, setCameraActive] = useState(true);

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
        return () => {
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
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
            setResult(text || "No text detected.");
        } catch (err) {
            setResult("Error scanning text.");
        } finally {
            setIsScanning(false);
            setCameraActive(false);
        }
    };

    const reset = () => {
        setResult(null);
        setCameraActive(true);
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
            {!cameraActive && result && (
                <div className="absolute inset-0 z-30 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-white text-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <ScanLine size={20} />
                            </div>
                            <h3 className="text-xl font-bold">Detected Text</h3>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 min-h-[80px]">
                            <p className="font-mono text-sm text-slate-700 leading-relaxed">{result}</p>
                        </div>

                        <button
                            onClick={reset}
                            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-600/30"
                        >
                            <RefreshCw size={20} />
                            Scan Another
                        </button>
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

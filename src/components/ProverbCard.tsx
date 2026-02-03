import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, ScrollText, Sparkles, Share2, Loader2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { proverbs } from '../data/proverbs';

const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
};

export const ProverbCard = () => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isSharing, setIsSharing] = useState(false);

    // Use useMemo to derived the daily proverb
    const dailyProverb = useMemo(() => {
        const date = new Date();
        const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        const index = dayOfYear % proverbs.length;
        return proverbs[index];
    }, []);

    const handleShare = async () => {
        if (!cardRef.current || isSharing) return;

        try {
            setIsSharing(true);
            console.log('Starting share generation...');

            // Generate Image
            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                backgroundColor: '#fff7ed', // Force light background
                pixelRatio: 2,
                skipFonts: true, // Prevent CORS "Failed to fetch" on fonts
                filter: (node) => {
                    // Safety check: Ensure node is an Element before checking classList
                    if (node instanceof Element && node.classList) {
                        return !node.classList.contains('exclude-share');
                    }
                    return true;
                }
            });

            console.log('Image generated successfully.');
            // Use manual conversion instead of fetch(dataUrl) which can fail in some contexts
            const blob = dataURItoBlob(dataUrl);
            const file = new File([blob], `awal-wisdom-${new Date().toISOString().split('T')[0]}.png`, { type: 'image/png' });

            // Web Share API
            if (navigator.share && navigator.canShare({ files: [file] })) {
                console.log('Using Web Share API');
                await navigator.share({
                    title: 'Awal - Wisdom of the Day',
                    text: `"${dailyProverb.text_latin}" - ${dailyProverb.translation}\n\nDiscover more on Awal Dictionary.`,
                    files: [file]
                });
            } else {
                console.log('Web Share API not available or files not supported. Downloading...');
                // Fallback: Download
                const link = document.createElement('a');
                link.download = file.name;
                link.href = dataUrl;
                link.click();
            }

        } catch (err) {
            console.error('Sharing failed:', err);
            alert(`Sharing failed: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 border border-amber-100 dark:border-slate-700 shadow-xl"
        >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-8 text-amber-500/10 dark:text-amber-500/5">
                <Quote size={120} />
            </div>

            <div className="relative z-10 p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                            <ScrollText size={20} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-500">
                            Inzan (Wisdom of the Day)
                        </span>
                    </div>

                    <button
                        onClick={handleShare}
                        disabled={isSharing}
                        className="exclude-share p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-blue-500 transition-colors"
                        title="Share Image"
                    >
                        {isSharing ? <Loader2 size={20} className="animate-spin" /> : <Share2 size={20} />}
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    {/* Tifinagh */}
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 tifinagh-text leading-relaxed">
                        {dailyProverb.text_tifinagh}
                    </h3>

                    {/* Latin */}
                    <p className="text-lg font-serif italic text-slate-600 dark:text-slate-400 font-medium">
                        "{dailyProverb.text_latin}"
                    </p>

                    {/* Divider */}
                    <div className="w-12 h-1 bg-amber-300 dark:bg-amber-700/50 rounded-full my-4" />

                    {/* Meaning */}
                    <div className="bg-white/60 dark:bg-black/20 rounded-xl p-4 backdrop-blur-sm border border-white/40 dark:border-white/5">
                        <div className="flex items-start gap-3">
                            <Sparkles size={16} className="text-amber-500 mt-1 shrink-0" />
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-1">
                                    {dailyProverb.translation}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {dailyProverb.meaning}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer / Region */}
                <div className="mt-6 flex justify-end">
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                        Region: {dailyProverb.region || 'North Africa'}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

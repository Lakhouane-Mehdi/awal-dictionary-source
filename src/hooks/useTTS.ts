import { useState, useCallback, useEffect } from 'react';

export const useTTS = () => {
    const [speaking, setSpeaking] = useState(false);
    const [supported, setSupported] = useState(false);

    useEffect(() => {
        setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
    }, []);

    const speak = useCallback((text: string) => {
        if (!supported || !text) return;

        // Cancel any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Voice Selection Logic
        // 1. Try to find a French voice (often better phonetics for Tamazight/Latin than English)
        // 2. Fallback to default
        const voices = window.speechSynthesis.getVoices();
        const frVoice = voices.find(v => v.lang.startsWith('fr'));

        if (frVoice) {
            utterance.voice = frVoice;
            // Slightly slower rate for clarity
            utterance.rate = 0.9;
        } else {
            // English fallback
            utterance.rate = 0.85;
        }

        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [supported]);

    const cancel = useCallback(() => {
        if (supported) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
        }
    }, [supported]);

    return { speak, cancel, speaking, supported };
};

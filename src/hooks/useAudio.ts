import { useCallback } from 'react';

export const useAudio = () => {
    const speak = useCallback((text: string, lang = 'fr-FR') => {
        if (!window.speechSynthesis) {
            console.warn("Speech Synthesis not supported");
            return;
        }

        // Cancel previous speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang; // Defaulting to French as it's often the closest approximation for North African dialects available in standard engines
        utterance.rate = 0.9;
        utterance.pitch = 1;

        window.speechSynthesis.speak(utterance);
    }, []);

    return { speak };
};

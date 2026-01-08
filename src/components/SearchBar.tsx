import { Search, Mic, X, MicOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface SearchBarProps {
    value: string;
    onChange: (val: string) => void;
    onClear: () => void;
}

export const SearchBar = ({ value, onChange, onClear }: SearchBarProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechRecognition();

    // Auto-update value when transcript changes
    useEffect(() => {
        if (transcript) {
            onChange(transcript);
        }
    }, [transcript, onChange]);

    const handleMicClick = () => {
        if (isListening) {
            stopListening();
        } else {
            resetTranscript();
            startListening();
        }
    };

    return (
        <div className={`
            glass-panel flex items-center p-3 transition-all duration-300 transform
            ${isFocused ? 'ring-4 ring-blue-500/20 scale-[1.01]' : 'hover:bg-white/60'}
            ${isListening ? 'ring-4 ring-red-500/20 shadow-red-500/10' : ''}
        `}>
            <Search className={`ml-2 transition-colors duration-300 ${isFocused ? 'text-blue-600' : 'text-slate-400'}`} size={20} />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={isListening ? "Listening..." : "Search 'Argaz'..."}
                className="flex-1 bg-transparent border-none outline-none px-4 py-1 text-lg font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
            {value && (
                <button onClick={onClear} className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
                    <X size={18} />
                </button>
            )}
            <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-2"></div>
            <button
                onClick={handleMicClick}
                className={`p-2 rounded-lg transition-all duration-300 ${isListening ? 'bg-red-50 text-red-500 animate-pulse' : 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/40'}`}
                title="Voice Search"
            >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
        </div>
    );
};

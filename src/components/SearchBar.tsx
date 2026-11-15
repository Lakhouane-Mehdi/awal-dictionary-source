import { Search, Mic, X, MicOff, Keyboard } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import type { DictionaryEntry } from '../data/dictionary';
import { TifinaghKeyboard } from './TifinaghKeyboard';
import { insertText, deleteBackward, type Edit } from '../utils/textEditing';

interface SearchBarProps {
    value: string;
    onChange: (val: string) => void;
    onClear: () => void;
    results?: DictionaryEntry[];
    onSelect?: (entry: DictionaryEntry) => void;
}

export const SearchBar = ({ value, onChange, onClear, results = [], onSelect }: SearchBarProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [keyboardOpen, setKeyboardOpen] = useState(false);
    const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechRecognition();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    // Put recognised speech into the box, once per new transcript. The
    // parent passes a new onChange on every render; with it as a dependency
    // this re-ran on each keystroke and overwrote typing with the old
    // transcript, so it is read through a ref instead.
    const onChangeRef = useRef(onChange);
    useEffect(() => { onChangeRef.current = onChange; });
    useEffect(() => {
        if (transcript) onChangeRef.current(transcript);
    }, [transcript]);

    const handleMicClick = () => {
        if (isListening) {
            stopListening();
        } else {
            resetTranscript();
            startListening();
        }
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // The suggestions would cover the on-screen keyboard, so they wait until it is closed
    const showDropdown = isFocused && !keyboardOpen && value.length > 0 && results.length > 0 && !!onSelect;

    // Typing changes the suggestion list, so drop the stale highlight
    const handleChange = (next: string) => {
        setActiveIndex(-1);
        onChange(next);
    };

    // On-screen keyboard: edit at the caret, then put the caret back after
    // React has written the new value into the field
    const applyEdit = (edit: Edit) => {
        handleChange(edit.value);
        requestAnimationFrame(() => {
            const input = inputRef.current;
            if (!input) return;
            input.focus();
            input.setSelectionRange(edit.caret, edit.caret);
        });
    };
    const selection = (): [number, number] => {
        const input = inputRef.current;
        const start = input?.selectionStart ?? value.length;
        return [start, input?.selectionEnd ?? start];
    };
    const typeKey = (char: string) => applyEdit(insertText(value, ...selection(), char));
    const backspace = () => applyEdit(deleteBackward(value, ...selection()));

    // Keep the highlighted option scrolled into view during keyboard navigation
    useEffect(() => {
        if (activeIndex < 0 || !listRef.current) return;
        listRef.current.children[activeIndex]?.scrollIntoView({ block: 'nearest' });
    }, [activeIndex]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showDropdown) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex(prev => (prev + 1) % results.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex(prev => (prev - 1 + results.length) % results.length);
                break;
            case 'Enter':
                if (activeIndex >= 0 && activeIndex < results.length) {
                    e.preventDefault();
                    onSelect?.(results[activeIndex]);
                    setIsFocused(false);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setIsFocused(false);
                setActiveIndex(-1);
                inputRef.current?.blur();
                break;
            case 'Tab':
                setIsFocused(false);
                break;
        }
    };

    const activeOptionId = activeIndex >= 0 ? `search-option-${results[activeIndex]?.id}` : undefined;

    return (
        <div ref={wrapperRef} className="relative w-full z-50">
            <div
                className={`
                glass-panel flex items-center p-3 transition duration-300
                ${isFocused ? 'ring-2 ring-accent-400/50' : ''}
                ${isListening ? 'ring-2 ring-ruby-500/50' : ''}
                ${showDropdown ? 'rounded-b-none' : ''}
            `}
                role="combobox"
                aria-expanded={showDropdown}
                aria-haspopup="listbox"
                aria-owns="search-suggestions"
            >
                <Search className={`ml-2 transition-colors duration-300 ${isFocused ? 'text-accent-500' : 'text-indigo-300 dark:text-indigo-400'}`} size={20} />
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={isListening ? "Listening…" : "Search, e.g. argaz…"}
                    className="flex-1 min-w-0 bg-transparent border-none outline-none px-2 sm:px-4 py-1 text-lg font-medium text-indigo-800 dark:text-sand-100 placeholder-indigo-300 dark:placeholder-indigo-400"
                    aria-label="Search the dictionary"
                    aria-autocomplete="list"
                    aria-controls="search-suggestions"
                    aria-activedescendant={activeOptionId}
                    autoComplete="off"
                    // While the Tifinagh keyboard is open, phones keep their
                    // own keyboard closed so the two do not stack
                    inputMode={keyboardOpen ? 'none' : undefined}
                />
                {value && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="p-2 text-indigo-300 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-200 transition-colors"
                        aria-label="Clear search"
                        title="Clear search"
                    >
                        <X size={18} />
                    </button>
                )}
                <div className="w-px h-6 bg-indigo-700/12 dark:bg-white/12 mx-2"></div>
                <button
                    type="button"
                    onClick={() => setKeyboardOpen(open => !open)}
                    className={`p-2 rounded-lg transition-colors ${keyboardOpen ? 'bg-accent-50 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300' : 'text-indigo-500 dark:text-indigo-300 hover:text-accent-600'}`}
                    title="Tifinagh keyboard"
                    aria-label={keyboardOpen ? 'Close the Tifinagh keyboard' : 'Open the Tifinagh keyboard'}
                    aria-pressed={keyboardOpen}
                    aria-controls="tifinagh-keyboard"
                >
                    <Keyboard size={20} />
                </button>
                <button
                    type="button"
                    onClick={handleMicClick}
                    className={`p-2 rounded-lg transition duration-300 ${isListening ? 'bg-ruby-50 text-ruby-600 dark:bg-ruby-900/30 dark:text-ruby-300 animate-pulse' : 'text-indigo-500 dark:text-indigo-300 hover:text-accent-500'}`}
                    title="Voice Search"
                    aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
                    aria-pressed={isListening}
                >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
            </div>

            {keyboardOpen && (
                <div id="tifinagh-keyboard" className="glass-panel mt-2">
                    <TifinaghKeyboard onKey={typeKey} onBackspace={backspace} />
                </div>
            )}

            {/* Autocomplete Dropdown */}
            {showDropdown && (
                <div className="absolute top-full left-0 w-full bg-white dark:bg-night-800 border border-t-0 border-indigo-700/10 dark:border-white/10 rounded-b-xl shadow-panel-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <ul
                        ref={listRef}
                        id="search-suggestions"
                        role="listbox"
                        aria-label="Search suggestions"
                        className="max-h-60 overflow-y-auto"
                    >
                        {results.map((entry, index) => (
                            <li
                                key={entry.id}
                                id={`search-option-${entry.id}`}
                                role="option"
                                aria-selected={index === activeIndex}
                                onPointerDown={() => onSelect?.(entry)}
                                onMouseEnter={() => setActiveIndex(index)}
                                className={`px-4 py-3 cursor-pointer flex justify-between items-center gap-3 group transition-colors ${
                                    index === activeIndex
                                        ? 'bg-accent-50 dark:bg-white/5'
                                        : 'hover:bg-sand-100 dark:hover:bg-white/5'
                                }`}
                            >
                                <div className="flex flex-col min-w-0">
                                    <span className="font-semibold text-indigo-800 dark:text-sand-100 truncate">
                                        {entry.term_latin}
                                    </span>
                                    <span className="text-sm text-indigo-400 dark:text-indigo-300 truncate max-w-[200px] sm:max-w-xs">{entry.definition}</span>
                                </div>
                                <span className="font-tifinagh text-xl text-accent-500 dark:text-accent-400 shrink-0">
                                    {entry.term_tifinagh}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

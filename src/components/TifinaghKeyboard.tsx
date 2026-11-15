import { Delete } from 'lucide-react';
import { tifinaghAlphabet } from '../data/tifinagh';

interface TifinaghKeyboardProps {
    onKey: (char: string) => void;
    onBackspace: () => void;
}

// The IRCAM alphabet in its usual order, plus the labialisation mark used
// in words such as ⴰⴳⵯⵎⴰⵔ (agʷmar, horse)
const KEYS = [
    ...tifinaghAlphabet.map(l => ({ char: l.char, hint: l.latin.split(' ')[0].toLowerCase(), name: l.name })),
    { char: 'ⵯ', hint: 'ʷ', name: 'Labialisation mark' },
];

// Keys must not take focus away from the text field, or the caret position
// is lost and phones close their own keyboard and reopen it on every tap.
const keepFocus = (e: React.PointerEvent) => e.preventDefault();

export const TifinaghKeyboard = ({ onKey, onBackspace }: TifinaghKeyboardProps) => (
    <div
        role="group"
        aria-label="Tifinagh keyboard"
        className="grid grid-cols-7 sm:grid-cols-9 gap-1.5 p-3"
    >
        {/* 32 keys: 4 full rows of 7 plus 4 keys, or 3 rows of 9 plus 5. The
            backspace fills the rest of that last row (3 or 4 cells) and the
            space bar takes a row of its own. Recount if keys are added. */}
        {KEYS.map(key => (
            <button
                key={key.char}
                type="button"
                onPointerDown={keepFocus}
                onClick={() => onKey(key.char)}
                aria-label={`${key.name} (${key.hint})`}
                title={`${key.name} — ${key.hint}`}
                className="flex flex-col items-center justify-center h-12 rounded-lg bg-sand-100 dark:bg-white/5 hover:bg-accent-50 dark:hover:bg-accent-900/30 active:scale-95 transition"
            >
                <span className="font-tifinagh text-xl leading-none text-indigo-800 dark:text-sand-100">{key.char}</span>
                <span className="text-[10px] leading-none mt-1 text-indigo-400 dark:text-indigo-300">{key.hint}</span>
            </button>
        ))}
        <button
            type="button"
            onPointerDown={keepFocus}
            onClick={onBackspace}
            aria-label="Delete the letter before the cursor"
            title="Backspace"
            className="col-span-3 sm:col-span-4 h-12 rounded-lg bg-sand-100 dark:bg-white/5 hover:bg-ruby-50 dark:hover:bg-ruby-900/30 flex items-center justify-center text-indigo-500 dark:text-indigo-300 active:scale-95 transition"
        >
            <Delete size={18} />
        </button>
        <button
            type="button"
            onPointerDown={keepFocus}
            onClick={() => onKey(' ')}
            aria-label="Space"
            className="col-span-full h-12 rounded-lg bg-sand-100 dark:bg-white/5 hover:bg-accent-50 dark:hover:bg-accent-900/30 text-xs font-semibold text-indigo-500 dark:text-indigo-300 active:scale-95 transition"
        >
            space
        </button>
    </div>
);

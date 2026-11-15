// Editing a text field's value at the caret, as an on-screen keyboard
// needs to. Pure functions, so the rules are testable without a DOM.

export interface Edit {
    value: string;
    /** Where the caret goes after the edit */
    caret: number;
}

/** Replaces the selection (or inserts at the caret) with `text`. */
export const insertText = (value: string, start: number, end: number, text: string): Edit => ({
    value: value.slice(0, start) + text + value.slice(end),
    caret: start + text.length,
});

/**
 * Deletes the selection, or the character before the caret when nothing is
 * selected. Removes a whole code point, so a letter outside the Basic
 * Multilingual Plane is never split in half.
 */
export const deleteBackward = (value: string, start: number, end: number): Edit => {
    if (start !== end) return { value: value.slice(0, start) + value.slice(end), caret: start };
    if (start === 0) return { value, caret: 0 };
    const before = Array.from(value.slice(0, start));
    before.pop();
    const head = before.join('');
    return { value: head + value.slice(start), caret: head.length };
};

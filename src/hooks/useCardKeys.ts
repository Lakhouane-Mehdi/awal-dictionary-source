import { useEffect, useRef } from 'react';

/**
 * Keyboard shortcuts for a flashcard: Space or Enter reveals, and the keys
 * in `numberKeys` ("1".."4") pick an answer once revealed. Ignored while
 * typing in a field or when a modifier is held, so it never fights the
 * search box or browser shortcuts.
 */
export const useCardKeys = (handlers: {
    revealed: boolean;
    onReveal: () => void;
    onNumber?: (n: number) => void;
}) => {
    // Latest handlers through a ref, so the listener is added only once
    const latest = useRef(handlers);
    useEffect(() => { latest.current = handlers; });

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return;
            const target = e.target as HTMLElement | null;
            if (target?.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]')) return;
            const { revealed, onReveal, onNumber } = latest.current;
            if (!revealed && (e.key === ' ' || e.key === 'Enter')) {
                // A focused button would also act on Enter/Space; reveal once
                if (target?.closest('button, a')) return;
                e.preventDefault();
                onReveal();
            } else if (revealed && onNumber && /^[1-9]$/.test(e.key)) {
                e.preventDefault();
                onNumber(Number(e.key));
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);
};

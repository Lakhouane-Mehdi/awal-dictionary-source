import { useEffect, useRef } from 'react';

/**
 * Keyboard and scroll behaviour every pop-up window needs:
 * - Escape closes it;
 * - focus moves into it when it opens and back to the control that opened
 *   it when it closes, so keyboard and screen-reader users are not lost;
 * - the page behind it does not scroll.
 *
 * Attach the returned ref to the dialog panel, together with
 * role="dialog", aria-modal="true", aria-labelledby and tabIndex={-1}.
 */
export const useDialog = <T extends HTMLElement = HTMLDivElement>(isOpen: boolean, onClose: () => void) => {
    const panelRef = useRef<T>(null);
    // Read through a ref so a parent passing a new function every render
    // does not re-run the effect (and steal focus back) on each render
    const onCloseRef = useRef(onClose);
    useEffect(() => { onCloseRef.current = onClose; });

    useEffect(() => {
        if (!isOpen) return undefined;
        const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const { overflow } = document.body.style;
        document.body.style.overflow = 'hidden';
        // The panel mounts in the same commit; focus it once it is there
        const frame = requestAnimationFrame(() => panelRef.current?.focus());

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                onCloseRef.current();
            }
        };
        document.addEventListener('keydown', onKeyDown);

        return () => {
            cancelAnimationFrame(frame);
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = overflow;
            opener?.focus();
        };
    }, [isOpen]);

    return panelRef;
};

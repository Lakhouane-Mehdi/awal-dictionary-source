// Safe access to localStorage. Reading or writing throws in some private
// windows and when site data is blocked, and a stored value can be
// corrupted or left over from an older version of the app. Every caller
// gets a working fallback instead of a crash.

export const readString = (key: string): string | null => {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
};

export const writeString = (key: string, value: string): void => {
    try {
        localStorage.setItem(key, value);
    } catch {
        // Storage blocked or full: the value lasts for this visit only
    }
};

export const removeKey = (key: string): void => {
    try {
        localStorage.removeItem(key);
    } catch {
        // Nothing to clean up when storage is blocked
    }
};

/**
 * A stored JSON value, or `fallback` when it is missing, unreadable or
 * rejected by `isValid`.
 */
export const readJSON = <T>(key: string, fallback: T, isValid: (value: unknown) => value is T): T => {
    const raw = readString(key);
    if (raw === null) return fallback;
    try {
        const value: unknown = JSON.parse(raw);
        return isValid(value) ? value : fallback;
    } catch {
        return fallback;
    }
};

export const writeJSON = (key: string, value: unknown): void => writeString(key, JSON.stringify(value));

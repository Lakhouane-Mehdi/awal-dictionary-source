import { createContext, useContext, useEffect, useState } from 'react';
import { readString, removeKey, writeString } from '../utils/storage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const THEME_CHOICE_KEY = 'theme-choice';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    // Everyone starts in light mode; dark mode is only ever the visitor's own
    // choice. The old 'theme' key was written on every visit, copying the
    // system setting, so it says nothing about a choice and is ignored.
    const [theme, setTheme] = useState<Theme>(() => {
        return readString(THEME_CHOICE_KEY) === 'dark' ? 'dark' : 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    const toggleTheme = () => {
        const next: Theme = theme === 'light' ? 'dark' : 'light';
        setTheme(next);
        writeString(THEME_CHOICE_KEY, next);
        removeKey('theme');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};

import { createContext, useContext, useEffect, useState } from 'react';

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
        try {
            return localStorage.getItem(THEME_CHOICE_KEY) === 'dark' ? 'dark' : 'light';
        } catch {
            return 'light';
        }
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    const toggleTheme = () => {
        const next: Theme = theme === 'light' ? 'dark' : 'light';
        setTheme(next);
        try {
            localStorage.setItem(THEME_CHOICE_KEY, next);
            localStorage.removeItem('theme');
        } catch {
            // Storage blocked: the choice lasts until the page is closed
        }
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

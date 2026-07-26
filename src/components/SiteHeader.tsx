import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, Eye, Moon, Sun, Trophy } from 'lucide-react';
import { useScript } from '../context/ScriptContext';
import { useTheme } from '../context/ThemeContext';

const NAV_LINKS = [
    { to: '/browse', label: 'Browse' },
    { to: '/categories', label: 'Categories' },
    { to: '/roots', label: 'Roots' },
    { to: '/alphabet', label: 'Alphabet' },
    { to: '/proverbs', label: 'Proverbs' },
    { to: '/learn', label: 'Learn' },
    { to: '/tools', label: 'Tools' },
    { to: '/about', label: 'About' },
];

interface SiteHeaderProps {
    onOpenAchievements: () => void;
}

export const SiteHeader = ({ onOpenAchievements }: SiteHeaderProps) => {
    const { script, toggleScript } = useScript();
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const scriptLabel = script === 'latin' ? 'ABC' : script === 'tifinagh' ? 'ⴰⴱⵛ' : 'أ ب ت';

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
            isActive
                ? 'text-saffron-700 dark:text-saffron-300 bg-saffron-50 dark:bg-saffron-900/20'
                : 'text-indigo-500 dark:text-indigo-200 hover:text-saffron-600 dark:hover:text-saffron-300'
        }`;

    return (
        <header className="glass-header">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between h-16 gap-4">
                    {/* Wordmark */}
                    <Link to="/" className="flex items-baseline gap-2 shrink-0 group">
                        <span className="font-display text-2xl font-bold text-indigo-700 dark:text-sand-100 tracking-tight">
                            Awal
                        </span>
                        <span className="tifinagh-text text-base text-saffron-500 group-hover:text-saffron-600 transition-colors">
                            ⴰⵡⴰⵍ
                        </span>
                    </Link>

                    {/* Desktop navigation */}
                    <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center" aria-label="Main">
                        {NAV_LINKS.map(link => (
                            <NavLink key={link.to} to={link.to} className={linkClass}>
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Utilities */}
                    <div className="flex items-center gap-1 shrink-0">
                        <button
                            onClick={toggleScript}
                            className="w-9 h-9 rounded-lg flex flex-col items-center justify-center text-indigo-500 dark:text-indigo-200 hover:text-saffron-500 transition-colors"
                            title="Switch script"
                            aria-label={`Switch script. Current: ${scriptLabel}`}
                        >
                            <Eye size={16} />
                            <span className="text-[7px] font-bold leading-none mt-0.5">{scriptLabel}</span>
                        </button>
                        <button
                            onClick={onOpenAchievements}
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-saffron-500 hover:text-saffron-600 transition-colors"
                            title="Achievements"
                            aria-label="Achievements"
                        >
                            <Trophy size={17} />
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-indigo-500 dark:text-saffron-300 hover:text-saffron-500 transition-colors"
                            title="Toggle dark mode"
                            aria-label="Toggle dark mode"
                        >
                            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                        </button>

                        {/* Mobile menu trigger */}
                        <button
                            onClick={() => setIsMenuOpen(v => !v)}
                            className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-200"
                            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isMenuOpen}
                        >
                            {isMenuOpen ? <X size={19} /> : <Menu size={19} />}
                        </button>
                    </div>
                </div>

                {/* Mobile navigation panel */}
                {isMenuOpen && (
                    <nav
                        className="lg:hidden pb-4 grid grid-cols-2 gap-1 border-t border-indigo-700/10 dark:border-white/10 pt-3"
                        aria-label="Mobile"
                    >
                        {NAV_LINKS.map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={() => setIsMenuOpen(false)}
                                className={linkClass}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                )}
            </div>
        </header>
    );
};

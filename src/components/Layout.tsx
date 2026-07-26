import { Outlet, NavLink, Link } from 'react-router-dom';
import { Home, Heart, Grid, GraduationCap, PenLine } from 'lucide-react';
import { useState } from 'react';
import { CookieBanner } from './legal/CookieBanner';
import { ContributionModal } from './ContributionModal';
import { AchievementsModal } from './AchievementsModal';
import { OnboardingTour } from './OnboardingTour';
import { SiteHeader } from './SiteHeader';

const FOOTER_SECTIONS: { title: string; links: { to: string; label: string }[] }[] = [
    {
        title: 'Dictionary',
        links: [
            { to: '/', label: 'Search' },
            { to: '/browse', label: 'Browse A–Z' },
            { to: '/categories', label: 'Categories' },
            { to: '/roots', label: 'Word roots' },
        ],
    },
    {
        title: 'Learn',
        links: [
            { to: '/learn', label: 'Learning hub' },
            { to: '/alphabet', label: 'Tifinagh alphabet' },
            { to: '/learn/vocabulary', label: 'Flashcards' },
            { to: '/tools/quiz', label: 'Quiz' },
        ],
    },
    {
        title: 'Culture',
        links: [
            { to: '/proverbs', label: 'Proverbs' },
            { to: '/tools/conjugator', label: 'Verb conjugator' },
            { to: '/tools/scan', label: 'Scan to translate' },
            { to: '/favorites', label: 'Saved words' },
        ],
    },
    {
        title: 'Project',
        links: [
            { to: '/about', label: 'About' },
            { to: '/tools/community', label: 'Community' },
            { to: '/privacy', label: 'Privacy' },
            { to: '/imprint', label: 'Imprint' },
        ],
    },
];

export const Layout = () => {
    const [isContributionOpen, setIsContributionOpen] = useState(false);
    const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);

    return (
        <div className="app-shell flex flex-col min-h-screen relative font-sans selection:bg-saffron-200 selection:text-indigo-900">
            <SiteHeader onOpenAchievements={() => setIsAchievementsOpen(true)} />

            {/* Contribution FAB (Fixed Bottom Right, above Nav) */}
            <button
                id="tour-contribute"
                onClick={() => setIsContributionOpen(true)}
                className="lg:hidden fixed bottom-24 right-4 z-[90] bg-indigo-600 hover:bg-indigo-700 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-panel-lg active:scale-95 transition-all"
                title="Suggest Edit / Contribute"
                aria-label="Suggest an edit or contribute a word"
            >
                <PenLine size={19} />
            </button>

            {/* Main Content Area with padding for Nav */}
            <main className="flex-1 pb-28 lg:pb-16 px-4 pt-8 max-w-3xl lg:max-w-5xl mx-auto w-full">
                <Outlet />

            </main>

            {/* Site footer */}
            <footer className="border-t border-indigo-700/10 dark:border-white/10 mt-8">
                <div className="max-w-3xl lg:max-w-5xl mx-auto px-4 py-10 pb-32 lg:pb-10">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
                        {FOOTER_SECTIONS.map(section => (
                            <div key={section.title}>
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-400 dark:text-indigo-300 mb-3">
                                    {section.title}
                                </h2>
                                <ul className="space-y-2">
                                    {section.links.map(link => (
                                        <li key={link.to}>
                                            <Link
                                                to={link.to}
                                                className="text-sm text-indigo-500 dark:text-indigo-200 hover:text-saffron-600 dark:hover:text-saffron-300 transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="pt-6 border-t border-indigo-700/10 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
                        <p className="text-xs text-indigo-400 dark:text-indigo-300">
                            Awal · Made by Mehdi Lakhouane · © {new Date().getFullYear()}
                        </p>
                        <div className="flex gap-4 text-xs text-indigo-400 dark:text-indigo-300">
                            <button
                                onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
                                className="hover:text-saffron-600 dark:hover:text-saffron-300 transition-colors"
                            >
                                Cookie Settings
                            </button>
                            <button
                                onClick={() => setIsContributionOpen(true)}
                                className="font-semibold hover:text-saffron-600 dark:hover:text-saffron-300 transition-colors"
                            >
                                Contribute
                            </button>
                        </div>
                    </div>
                </div>
            </footer>

            <CookieBanner />
            <ContributionModal isOpen={isContributionOpen} onClose={() => setIsContributionOpen(false)} />
            <AchievementsModal isOpen={isAchievementsOpen} onClose={() => setIsAchievementsOpen(false)} />
            <OnboardingTour />

            {/* Floating Dock Navigation */}
            <nav
                className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-md glass-panel h-16 flex items-center justify-around z-50 px-2 shadow-panel-lg"
                aria-label="Primary"
            >
                <NavItem to="/" icon={<Home strokeWidth={2.5} size={22} />} label="Search" />
                <NavItem to="/favorites" icon={<Heart strokeWidth={2.5} size={22} />} label="Saved" />
                <NavItem to="/learn" icon={<GraduationCap strokeWidth={2.5} size={22} />} label="Learn" />
                <NavItem to="/tools" icon={<Grid strokeWidth={2.5} size={22} />} label="Tools" />
            </nav>
        </div>
    );
};

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => `
                flex flex-col items-center justify-center w-16 h-full transition-all duration-300 relative
                ${isActive
                    ? 'text-indigo-700 dark:text-saffron-300'
                    : 'text-indigo-400/70 dark:text-indigo-300/60 hover:text-indigo-600 dark:hover:text-indigo-200'}
            `}
        >
            {({ isActive }) => (
                <>
                    <div className="mb-0.5">{icon}</div>
                    <span className="text-[10px] font-bold tracking-tight">{label}</span>
                    {isActive && (
                        <span className="absolute -bottom-1 w-1 h-1 bg-current rounded-full" />
                    )}
                </>
            )}
        </NavLink>
    );
};

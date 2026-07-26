import { Outlet, NavLink, Link } from 'react-router-dom';
import { Home, Heart, Grid, GraduationCap, Eye, PenLine, Trophy } from 'lucide-react'; // Added Trophy
import { useState } from 'react';
import { useScript } from '../context/ScriptContext';
import { CookieBanner } from './legal/CookieBanner';
import { ContributionModal } from './ContributionModal';
import { AchievementsModal } from './AchievementsModal';
import { OnboardingTour } from './OnboardingTour';

export const Layout = () => {
    const { script, toggleScript } = useScript();
    const [isContributionOpen, setIsContributionOpen] = useState(false);
    const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);

    // Helper to get script label
    const getScriptLabel = () => {
        switch (script) {
            case 'latin': return 'ABC';
            case 'tifinagh': return 'ⴰⴱⵛ';
            case 'arabic': return 'أ ب ت';
        }
    };

    return (
        <div className="app-shell flex flex-col min-h-screen relative font-sans selection:bg-saffron-200 selection:text-indigo-900">
            {/* Top Right Controls Group */}
            <div className="fixed top-3 right-3 z-[100] flex flex-col gap-2">
                {/* Script Toggle */}
                <button
                    id="tour-script-toggle"
                    onClick={toggleScript}
                    className="glass-panel w-10 h-10 rounded-full flex flex-col items-center justify-center active:scale-95 transition-all text-indigo-600 dark:text-indigo-200 hover:text-saffron-500"
                    title="Switch Script"
                    aria-label={`Switch script. Current: ${getScriptLabel()}`}
                >
                    <Eye size={17} />
                    <span className="text-[8px] font-bold mt-[-2px]">{getScriptLabel()}</span>
                </button>

                {/* Achievements Toggle */}
                <button
                    id="tour-achievements"
                    onClick={() => setIsAchievementsOpen(true)}
                    className="glass-panel w-10 h-10 rounded-full flex flex-col items-center justify-center active:scale-95 transition-all text-saffron-500 dark:text-saffron-400 hover:text-saffron-600"
                    title="Achievements"
                    aria-label="Achievements"
                >
                    <Trophy size={17} />
                </button>
            </div>

            {/* Contribution FAB (Fixed Bottom Right, above Nav) */}
            <button
                id="tour-contribute"
                onClick={() => setIsContributionOpen(true)}
                className="fixed bottom-24 right-4 z-[90] bg-indigo-600 hover:bg-indigo-700 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-panel-lg active:scale-95 transition-all"
                title="Suggest Edit / Contribute"
                aria-label="Suggest an edit or contribute a word"
            >
                <PenLine size={19} />
            </button>

            {/* Main Content Area with padding for Nav */}
            <main className="flex-1 pb-28 px-4 pt-6 max-w-lg mx-auto w-full">
                <Outlet />

                {/* Footer: attribution + legal */}
                <footer className="mt-16 mb-4 pt-6 border-t border-indigo-700/10 dark:border-white/10 text-center">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-indigo-400 dark:text-indigo-300 font-semibold mb-3">
                        Made by Mehdi Lakhouane
                    </p>
                    <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 text-xs text-indigo-400 dark:text-indigo-300">
                        <Link to="/privacy" className="hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors">Privacy</Link>
                        <span aria-hidden="true">·</span>
                        <Link to="/imprint" className="hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors">Imprint</Link>
                        <span aria-hidden="true">·</span>
                        <button
                            onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
                            className="hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors cursor-pointer"
                        >
                            Cookie Settings
                        </button>
                        <span aria-hidden="true">·</span>
                        <button
                            onClick={() => setIsContributionOpen(true)}
                            className="hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors cursor-pointer font-semibold"
                        >
                            Contribute
                        </button>
                    </div>
                </footer>
            </main>

            <CookieBanner />
            <ContributionModal isOpen={isContributionOpen} onClose={() => setIsContributionOpen(false)} />
            <AchievementsModal isOpen={isAchievementsOpen} onClose={() => setIsAchievementsOpen(false)} />
            <OnboardingTour />

            {/* Floating Dock Navigation */}
            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-md glass-panel h-16 flex items-center justify-around z-50 px-2 shadow-panel-lg">
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

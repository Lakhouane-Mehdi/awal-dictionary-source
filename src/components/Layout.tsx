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
        <div className="app-shell flex flex-col min-h-screen relative font-sans text-slate-800 selection:bg-blue-200">
            {/* Creative Top Creator Badge (Always Visible) */}
            <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[100] w-auto pointer-events-none">
                <div className="glass-panel px-4 py-1.5 rounded-full shadow-2xl border border-white/40 dark:border-white/10 backdrop-blur-md animate-in slide-in-from-top-4 duration-700 pointer-events-auto hover:scale-105 transition-transform flex items-center gap-2">
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500">Made by</span>
                    <span className="text-[10px] font-black tracking-widest bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-yellow-200 dark:to-yellow-500 bg-clip-text text-transparent">
                        MEHDI LAKHOUANE
                    </span>
                </div>
            </div>

            {/* Top Right Controls Group */}
            <div className="fixed top-3 right-3 z-[100] flex flex-col gap-2">
                {/* Script Toggle */}
                <button
                    id="tour-script-toggle"
                    onClick={toggleScript}
                    className="glass-panel w-10 h-10 rounded-full flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all text-slate-600 dark:text-slate-300"
                    title="Switch Script"
                    aria-label={`Switch script. Current: ${getScriptLabel()}`}
                >
                    <Eye size={18} />
                    <span className="text-[8px] font-bold mt-[-2px]">{getScriptLabel()}</span>
                </button>

                {/* Achievements Toggle */}
                <button
                    id="tour-achievements"
                    onClick={() => setIsAchievementsOpen(true)}
                    className="glass-panel w-10 h-10 rounded-full flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all text-amber-500 dark:text-amber-400"
                    title="Achievements"
                >
                    <Trophy size={18} />
                </button>
            </div>

            {/* Contribution FAB (Fixed Bottom Right, above Nav) */}
            <button
                id="tour-contribute"
                onClick={() => setIsContributionOpen(true)}
                className="fixed bottom-24 right-4 z-[90] bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl shadow-blue-600/30 active:scale-95 transition-all animate-in zoom-in duration-500"
                title="Suggest Edit / Contribute"
            >
                <PenLine size={20} />
            </button>

            {/* Main Content Area with padding for Nav */}
            <main className="flex-1 pb-28 px-4 pt-14 max-w-lg mx-auto w-full">
                <Outlet />

                {/* Legal Footer */}
                <footer className="mt-12 mb-4 flex justify-center gap-4 text-xs text-slate-400">
                    <Link to="/privacy" className="hover:text-slate-600 transition-colors">Privacy</Link>
                    <span>•</span>
                    <Link to="/imprint" className="hover:text-slate-600 transition-colors">Imprint</Link>
                    <span>•</span>
                    <button
                        onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
                        className="hover:text-slate-600 transition-colors cursor-pointer"
                        aria-label="Open Cookie Settings"
                    >
                        Cookie Settings
                    </button>
                    <span>•</span>
                    <button
                        onClick={() => setIsContributionOpen(true)}
                        className="hover:text-blue-500 transition-colors cursor-pointer font-bold"
                    >
                        Contribute
                    </button>
                </footer>
            </main>

            <CookieBanner />
            <ContributionModal isOpen={isContributionOpen} onClose={() => setIsContributionOpen(false)} />
            <AchievementsModal isOpen={isAchievementsOpen} onClose={() => setIsAchievementsOpen(false)} />
            <OnboardingTour />

            {/* Floating Dock Navigation */}
            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-md glass-panel h-16 flex items-center justify-around z-50 px-2 shadow-2xl shadow-blue-900/10">
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
                ${isActive ? 'text-blue-600 scale-110' : 'text-slate-400 hover:text-slate-600'}
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

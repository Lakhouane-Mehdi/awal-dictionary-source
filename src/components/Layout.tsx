import { Outlet } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { Home, Heart, Grid } from 'lucide-react';

export const Layout = () => {
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

            {/* Main Content Area with padding for Nav */}
            <main className="flex-1 pb-28 px-4 pt-14 max-w-lg mx-auto w-full">
                <Outlet />
            </main>

            {/* Floating Dock Navigation */}
            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm glass-panel h-16 flex items-center justify-around z-50 px-2 shadow-2xl shadow-blue-900/10">
                <NavItem to="/" icon={<Home strokeWidth={2.5} size={22} />} label="Search" />
                <NavItem to="/favorites" icon={<Heart strokeWidth={2.5} size={22} />} label="Saved" />
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

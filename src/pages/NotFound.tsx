import { Link } from 'react-router-dom';
import { Compass, Home, Search } from 'lucide-react';
import { useEffect } from 'react';

export const NotFound = () => {
    useEffect(() => {
        document.title = 'Page Not Found - Awal Dictionary';
    }, []);

    return (
        <div className="w-full flex flex-col items-center justify-center text-center py-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="glass-panel p-10 max-w-md w-full">
                <Compass size={56} className="mx-auto mb-6 text-blue-500 opacity-70" />

                <h1 className="text-6xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent mb-3">
                    404
                </h1>

                <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                    This page wandered off
                </p>
                <p className="text-slate-500 dark:text-slate-400 mb-8">
                    The page you are looking for does not exist. Try searching the dictionary instead.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all active:scale-95"
                    >
                        <Search size={18} /> Search Words
                    </Link>
                    <Link
                        to="/learn"
                        className="flex items-center justify-center gap-2 glass-panel font-bold text-slate-600 dark:text-slate-300 py-3 px-6 rounded-xl hover:scale-105 transition-all active:scale-95"
                    >
                        <Home size={18} /> Learning Dojo
                    </Link>
                </div>
            </div>
        </div>
    );
};

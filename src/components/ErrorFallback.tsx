import { RefreshCw, AlertTriangle } from 'lucide-react';

interface ErrorFallbackProps {
    error?: Error;
    resetError?: () => void;
}

export const ErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-6">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <AlertTriangle size={40} className="text-red-500" />
                </div>

                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Something went wrong
                </h1>

                <p className="text-slate-500 dark:text-slate-400 mb-6">
                    We're sorry for the inconvenience. The application encountered an unexpected error.
                </p>

                {error && (
                    <details className="mb-6 text-left bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                        <summary className="cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-300">
                            Technical Details
                        </summary>
                        <pre className="mt-2 text-xs text-red-600 dark:text-red-400 overflow-auto">
                            {error.message}
                        </pre>
                    </details>
                )}

                <div className="flex flex-col gap-3">
                    {resetError && (
                        <button
                            onClick={resetError}
                            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                        >
                            <RefreshCw size={18} />
                            Try Again
                        </button>
                    )}

                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-3 px-6 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl font-medium transition-colors"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        </div>
    );
};

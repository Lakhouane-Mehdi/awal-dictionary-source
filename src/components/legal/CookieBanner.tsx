import React, { useState, useEffect } from 'react';
import { Shield, X, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DataService } from '../../services/DataService';

interface CookieConsent {
    essential: boolean;
    analytics: boolean;
    marketing: boolean;
}

export const CookieBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [consent, setConsent] = useState<CookieConsent>({
        essential: true, // Always true for essential cookies
        analytics: false,
        marketing: false,
    });

    useEffect(() => {
        const loadConsent = async () => {
            const savedConsent = await DataService.getConsent();
            if (!savedConsent) {
                setIsVisible(true);
            } else {
                setConsent(savedConsent);
            }
        };
        loadConsent();
    }, []);

    const handleAcceptAll = () => {
        const newConsent = { essential: true, analytics: true, marketing: true };
        saveConsent(newConsent);
    };

    const handleRejectNonEssential = () => {
        const newConsent = { essential: true, analytics: false, marketing: false };
        saveConsent(newConsent);
    };

    const saveConsent = (preferences: CookieConsent) => {
        // Add timestamp to the preference object before saving to ensure it matches the interface
        const consentWithTimestamp = {
            ...preferences,
            timestamp: new Date().toISOString()
        };
        DataService.saveConsent(consentWithTimestamp).then(() => {
            console.log('Consent saved asynchronously');
        });
        setConsent(preferences);
        setIsVisible(false);
    };

    const toggleSetting = (key: keyof CookieConsent) => {
        if (key === 'essential') return;
        setConsent(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSaveSettings = () => {
        saveConsent(consent);
    };

    useEffect(() => {
        const handleOpenSettings = () => {
            setIsVisible(true);
            setShowSettings(true);
        };
        window.addEventListener('open-cookie-settings', handleOpenSettings);
        return () => window.removeEventListener('open-cookie-settings', handleOpenSettings);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[200] p-4 bg-gray-900/95 backdrop-blur-md border-t border-gray-700 text-white shadow-2xl transition-all duration-300">
            <div className="max-w-6xl mx-auto">
                {!showSettings ? (
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-indigo-400" />
                                <h3 className="font-semibold text-lg">We value your privacy</h3>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed max-w-2xl">
                                We and our partners use cookies and other technologies to improve your experience, measure performance, and tailor marketing.
                                According to <strong>GDPR</strong> and <strong>global data laws</strong>, we need your consent for non-essential cookies.
                                <br />
                                <Link to="/privacy" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">Privacy Policy</Link> • <Link to="/imprint" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">Imprint</Link>
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto min-w-[300px]">
                            <button
                                onClick={() => setShowSettings(true)}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors border border-gray-600 flex items-center justify-center gap-2"
                                aria-label="Customize Cookie Settings"
                            >
                                <Settings className="w-4 h-4" /> Customize
                            </button>
                            <button
                                onClick={handleRejectNonEssential}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors border border-gray-600"
                            >
                                Reject All
                            </button>
                            <button
                                onClick={handleAcceptAll}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium shadow-lg shadow-indigo-900/50 transition-colors"
                            >
                                Accept All
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                            <h3 className="font-semibold text-lg">Cookie Preferences</h3>
                            <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white" aria-label="Close Settings"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            {/* Essential */}
                            <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 opacity-75 cursor-not-allowed">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium flex items-center gap-2"><Shield className="w-4 h-4 text-green-400" /> Essential</span>
                                    <input type="checkbox" checked disabled className="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-500" />
                                </div>
                                <p className="text-xs text-gray-400">Strictly necessary for security and core functionality. Cannot be disabled.</p>
                            </div>

                            {/* Analytics */}
                            <div
                                className="bg-gray-800 p-3 rounded-lg border border-gray-700 cursor-pointer hover:border-gray-600"
                                onClick={() => toggleSetting('analytics')}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium">Analytics</span>
                                    <input
                                        type="checkbox"
                                        checked={consent.analytics}
                                        onChange={() => toggleSetting('analytics')}
                                        className="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-500"
                                    />
                                </div>
                                <p className="text-xs text-gray-400">Help us improve by collecting anonymous usage data.</p>
                            </div>

                            {/* Marketing */}
                            <div
                                className="bg-gray-800 p-3 rounded-lg border border-gray-700 cursor-pointer hover:border-gray-600"
                                onClick={() => toggleSetting('marketing')}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium">Marketing</span>
                                    <input
                                        type="checkbox"
                                        checked={consent.marketing}
                                        onChange={() => toggleSetting('marketing')}
                                        className="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-500"
                                    />
                                </div>
                                <p className="text-xs text-gray-400">Allow personalized content and ads (if any).</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setShowSettings(false)}
                                className="px-4 py-2 text-gray-300 hover:text-white text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveSettings}
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium shadow-lg"
                            >
                                Save Preferences
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

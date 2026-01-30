import React, { createContext, useContext, useState, useEffect } from 'react';

type ScriptType = 'latin' | 'tifinagh' | 'arabic';

interface ScriptContextType {
    script: ScriptType;
    toggleScript: () => void;
    setScript: (script: ScriptType) => void;
}

const ScriptContext = createContext<ScriptContextType | undefined>(undefined);

export const ScriptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Default to 'latin' or read from localStorage if you want persistence
    const [script, setScriptState] = useState<ScriptType>(() => {
        const saved = localStorage.getItem('awal_script_pref');
        return (saved as ScriptType) || 'latin';
    });

    useEffect(() => {
        localStorage.setItem('awal_script_pref', script);
    }, [script]);

    const toggleScript = () => {
        setScriptState((prev) => {
            if (prev === 'latin') return 'tifinagh';
            if (prev === 'tifinagh') return 'arabic';
            return 'latin';
        });
    };

    const setScript = (newScript: ScriptType) => {
        setScriptState(newScript);
    };

    return (
        <ScriptContext.Provider value={{ script, toggleScript, setScript }}>
            {children}
        </ScriptContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useScript = () => {
    const context = useContext(ScriptContext);
    if (!context) {
        throw new Error('useScript must be used within a ScriptProvider');
    }
    return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { readString, writeString } from '../utils/storage';

type ScriptType = 'latin' | 'tifinagh' | 'arabic';

const SCRIPTS: ScriptType[] = ['latin', 'tifinagh', 'arabic'];
const SCRIPT_KEY = 'awal_script_pref';

interface ScriptContextType {
    script: ScriptType;
    toggleScript: () => void;
    setScript: (script: ScriptType) => void;
}

const ScriptContext = createContext<ScriptContextType | undefined>(undefined);

export const ScriptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // The reader's chosen script, kept across visits. An unknown saved value
    // (corrupted, or from an older version) falls back to Latin
    const [script, setScriptState] = useState<ScriptType>(() => {
        const saved = readString(SCRIPT_KEY);
        return SCRIPTS.includes(saved as ScriptType) ? (saved as ScriptType) : 'latin';
    });

    useEffect(() => writeString(SCRIPT_KEY, script), [script]);

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

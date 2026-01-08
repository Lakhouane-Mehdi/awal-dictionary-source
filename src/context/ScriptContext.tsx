import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type ScriptType = 'latin' | 'tifinagh' | 'arabic';

interface ScriptContextType {
    script: ScriptType;
    setScript: (s: ScriptType) => void;
    toggleScript: () => void;
}

const ScriptContext = createContext<ScriptContextType | undefined>(undefined);

export const ScriptProvider = ({ children }: { children: ReactNode }) => {
    const [script, setScript] = useState<ScriptType>('latin');

    const toggleScript = () => {
        setScript(prev => {
            if (prev === 'latin') return 'tifinagh';
            if (prev === 'tifinagh') return 'arabic';
            return 'latin';
        });
    };

    return (
        <ScriptContext.Provider value={{ script, setScript, toggleScript }}>
            {children}
        </ScriptContext.Provider>
    );
};

export const useScript = () => {
    const context = useContext(ScriptContext);
    if (!context) throw new Error('useScript must be used within ScriptProvider');
    return context;
};

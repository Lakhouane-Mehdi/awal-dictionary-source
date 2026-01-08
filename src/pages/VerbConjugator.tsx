import { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Mock Data for Conjugation
const verbDatabase: Record<string, any> = {
    'etz': {
        root: 'Etz',
        meaning: 'To Sleep',
        forms: {
            past: { s1: 'Etzigh', s2: 'Tetzid', s3m: 'Ietza', s3f: 'Tetza', p1: 'Netza', p2: 'Tetzam', p3: 'Etzan' },
            present: { s1: 'Tetzagh', s2: 'Tetzad', s3m: 'Ietza', s3f: 'Tetza', p1: 'Netza', p2: 'Tetzam', p3: 'Etzan' }, // Simplified
            future: { s1: 'Ad etzgh', s2: 'Ad tetzed', s3m: 'Ad itz', s3f: 'Ad tetz', p1: 'Ad netz', p2: 'Ad tetzem', p3: 'Ad etzen' }
        }
    },
    'aru': {
        root: 'Aru',
        meaning: 'To Write',
        forms: {
            past: { s1: 'Urigh', s2: 'Turid', s3m: 'Iura', s3f: 'Tura', p1: 'Nura', p2: 'Turam', p3: 'Uran' },
            present: { s1: 'Ttarigh', s2: 'Ttarid', s3m: 'Ittari', s3f: 'Tttari', p1: 'Nttari', p2: 'Tttarim', p3: 'Tttarin' },
            future: { s1: 'Ad arigh', s2: 'Ad tarid', s3m: 'Ad yaru', s3f: 'Ad taru', p1: 'Ad naru', p2: 'Ad tarum', p3: 'Ad arun' }
        }
    }
};

export const VerbConjugator = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVerb, setSelectedVerb] = useState<string | null>(null);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        // Direct match for now
        const match = Object.keys(verbDatabase).find(k => k.includes(term.toLowerCase()));
        if (match) setSelectedVerb(match);
        else setSelectedVerb(null);
    };

    const verb = selectedVerb ? verbDatabase[selectedVerb] : null;

    return (
        <div className="p-4 w-full max-w-md mx-auto min-h-screen pb-20">
            <header className="mb-6 mt-2 flex items-center gap-3">
                <button onClick={() => navigate('/tools')} className="p-2 hover:bg-[var(--glass-bg)] rounded-full border border-transparent hover:border-[var(--glass-border)] transition-all">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-[var(--color-primary)]">Verb Conjugator</h1>
            </header>

            <div className="glass-panel flex items-center p-2 mb-6">
                <Search className="text-[var(--color-text-muted)] ml-2" size={20} />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Enter a verb (e.g. 'aru', 'etz')"
                    className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-lg"
                />
            </div>

            {verb ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-4"
                >
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold capitalize mb-1">{verb.root}</h2>
                        <p className="text-[var(--color-text-muted)]">{verb.meaning}</p>
                    </div>

                    <div className="space-y-6">
                        <ConjugationTable title="Past (Izri)" data={verb.forms.past} />
                        <ConjugationTable title="Present (Amawal)" data={verb.forms.present} />
                        <ConjugationTable title="Future (Imal)" data={verb.forms.future} />
                    </div>
                </motion.div>
            ) : (
                <div className="text-center text-[var(--color-text-muted)] mt-10">
                    <p>Type a verb root to see conjugation.</p>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                        <button onClick={() => handleSearch('aru')} className="px-3 py-1 bg-[var(--glass-bg)] rounded-full text-sm">Examples: Aru</button>
                        <button onClick={() => handleSearch('etz')} className="px-3 py-1 bg-[var(--glass-bg)] rounded-full text-sm">Etz</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const ConjugationTable = ({ title, data }: { title: string, data: any }) => (
    <div>
        <h3 className="text-sm font-bold uppercase text-[var(--color-text-muted)] mb-2 tracking-wider">{title}</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <Row label="Nekk (I)" value={data.s1} />
            <Row label="Keyyi (You m)" value={data.s2} />
            <Row label="Netta (He)" value={data.s3m} />
            <Row label="Nettat (She)" value={data.s3f} />
            <Row label="Nukni (We)" value={data.p1} />
            <Row label="Kunwi (You pl)" value={data.p2} />
            <Row label="Nitni (They)" value={data.p3} />
        </div>
    </div>
);

const Row = ({ label, value }: { label: string, value: string }) => (
    <>
        <span className="text-[var(--color-text-muted)] text-right pr-2 border-r border-[var(--glass-border)]">{label}</span>
        <span className="font-medium pl-1">{value}</span>
    </>
);

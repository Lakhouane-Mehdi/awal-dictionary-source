import { useState } from 'react';

export interface ContributionData {
    term: string;
    definition: string;
    type: 'correction' | 'new';
    notes?: string;
}

export const useContribution = () => {
    const [loading, setLoading] = useState(false);

    const submitContribution = (data: ContributionData) => {
        setLoading(true);

        // Simulating async delay for better UX (and to show loading state)
        setTimeout(() => {
            const subject = encodeURIComponent(`Awal Contribution: ${data.type.toUpperCase()} - ${data.term}`);
            const body = encodeURIComponent(
                `Type: ${data.type}
Term: ${data.term}
Definition: ${data.definition}
Notes: ${data.notes || 'N/A'}

--
Sent from Awal Web App`
            );

            // Open email client
            window.location.href = `mailto:contribute@awal.app?subject=${subject}&body=${body}`;
            setLoading(false);
        }, 800);
    };

    return { submitContribution, loading };
};

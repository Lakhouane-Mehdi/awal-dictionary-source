import { useState } from 'react';
import { newIssueUrl } from '../utils/author';

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
            const title = `${data.type === 'new' ? 'New word' : 'Correction'}: ${data.term}`;
            const body = [
                `**Type:** ${data.type === 'new' ? 'New word' : 'Correction'}`,
                `**Term:** ${data.term}`,
                `**Definition:** ${data.definition}`,
                `**Notes:** ${data.notes || '—'}`,
                '',
                '---',
                'Submitted from the Awal web app.',
            ].join('\n');

            // Open a prefilled GitHub issue in a new tab
            window.open(newIssueUrl(title, body), '_blank', 'noopener,noreferrer');
            setLoading(false);
        }, 600);
    };

    return { submitContribution, loading };
};

// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import { GamificationProvider, useGamification } from '../context/GamificationContext';

// Two separate components, as on the real site (a page and the header)
const Tracker = () => {
    const { trackAction } = useGamification();
    return <button onClick={() => trackAction('SEARCH')}>search</button>;
};
const Badges = () => {
    const { stats, unlocked } = useGamification();
    return <p data-testid="badges">{stats.totalSearches}:{unlocked.join(',')}</p>;
};

const renderApp = () =>
    render(
        <GamificationProvider>
            <Tracker />
            <Badges />
        </GamificationProvider>,
    );

describe('GamificationProvider', () => {
    beforeEach(() => localStorage.clear());
    afterEach(cleanup);

    it('shares progress between components and unlocks each badge once', () => {
        renderApp();
        act(() => screen.getByText('search').click());
        expect(screen.getByTestId('badges').textContent).toBe('1:novice_explorer');
        act(() => screen.getByText('search').click());
        expect(screen.getByTestId('badges').textContent).toBe('2:novice_explorer');
    });

    it('ignores corrupted saved stats instead of crashing', () => {
        localStorage.setItem('awal_stats', '{"totalSearches":"lots","streak":-4');
        localStorage.setItem('awal_unlocked_achievements', '{"oops":1}');
        renderApp();
        expect(screen.getByTestId('badges').textContent).toBe('0:');
    });

    it('restores saved progress', () => {
        localStorage.setItem('awal_stats', JSON.stringify({ totalSearches: 50, streak: 0, wordsLearned: 0, quizzesCompleted: 0 }));
        renderApp();
        expect(screen.getByTestId('badges').textContent).toBe('50:novice_explorer,seeker_of_wisdom');
    });
});

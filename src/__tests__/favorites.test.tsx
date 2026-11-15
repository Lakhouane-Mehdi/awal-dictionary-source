// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';

// In-memory stand-in for IndexedDB
const store = new Map<string, unknown>();
vi.mock('idb-keyval', () => ({
    get: async (key: string) => store.get(key),
    set: async (key: string, value: unknown) => { store.set(key, value); },
}));

const { useFavorites, toggleFavorite } = await import('../hooks/useFavorites');

const Heart = ({ id }: { id: string }) => {
    const { isFavorite } = useFavorites();
    return <button onClick={() => toggleFavorite(id)}>{id}:{isFavorite(id) ? 'saved' : 'not'}</button>;
};
const Count = () => {
    const { favorites, loaded } = useFavorites();
    return <p data-testid="count">{loaded ? favorites.length : 'loading'}</p>;
};

const flush = () => act(() => new Promise(r => setTimeout(r, 0)));

describe('useFavorites', () => {
    afterEach(cleanup);

    it('shares one list between components and keeps quick saves', async () => {
        render(<><Heart id="a" /><Heart id="b" /><Count /></>);
        await flush();
        expect(screen.getByTestId('count').textContent).toBe('0');

        // Two saves in a row from different cards: neither may be lost
        act(() => { screen.getByText('a:not').click(); screen.getByText('b:not').click(); });
        await flush();
        expect(screen.getByText('a:saved')).toBeTruthy();
        expect(screen.getByText('b:saved')).toBeTruthy();
        expect(store.get('favorites')).toEqual(['a', 'b']);

        act(() => screen.getByText('a:saved').click());
        await flush();
        expect(store.get('favorites')).toEqual(['b']);
        expect(screen.getByTestId('count').textContent).toBe('1');
    });
});

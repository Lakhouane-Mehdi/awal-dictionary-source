import { useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';
import { isLegacyId, migrateLegacyIds } from '../utils/legacyIds';

const STORAGE_KEY = 'favorites';
const CHANNEL = 'awal_favorites_sync';

const announceUpdate = () => {
    const channel = new BroadcastChannel(CHANNEL);
    channel.postMessage('UPDATE');
    channel.close();
};

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<string[]>([]);

    // Initial load & Listener
    useEffect(() => {
        const channel = new BroadcastChannel(CHANNEL);
        let active = true;

        const loadFavorites = async () => {
            const stored: string[] = (await get(STORAGE_KEY)) ?? [];
            // Favourites saved before PDF entries had stable IDs
            const current = await migrateLegacyIds(stored);
            if (current !== stored && stored.some(isLegacyId)) await set(STORAGE_KEY, current);
            if (active) setFavorites(current);
        };

        loadFavorites();

        channel.onmessage = (event) => {
            if (event.data === 'UPDATE') loadFavorites();
        };

        return () => {
            active = false;
            channel.close();
        };
    }, []);

    // Side effects stay outside the state updater: React may call updaters
    // twice, which used to write and broadcast twice.
    const toggleFavorite = (id: string) => {
        const next = favorites.includes(id)
            ? favorites.filter(fid => fid !== id)
            : [...favorites, id];
        setFavorites(next);
        set(STORAGE_KEY, next).then(announceUpdate);
    };

    const isFavorite = (id: string) => favorites.includes(id);

    return { favorites, toggleFavorite, isFavorite };
};

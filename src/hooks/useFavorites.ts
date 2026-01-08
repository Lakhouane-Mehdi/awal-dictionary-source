import { useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<string[]>([]);

    // BroadcastChannel for cross-tab sync
    const channel = new BroadcastChannel('awal_favorites_sync');

    // Load favorites from IDB
    const loadFavorites = () => {
        get('favorites').then((val) => {
            if (val) setFavorites(val);
        });
    };

    // Initial load & Listener
    useEffect(() => {
        loadFavorites();

        channel.onmessage = (event) => {
            if (event.data === 'UPDATE') {
                loadFavorites();
            }
        };

        return () => {
            channel.close();
        };
    }, []);

    // Toggle favorite logic
    const toggleFavorite = (id: string) => {
        setFavorites(prev => {
            const newFavs = prev.includes(id)
                ? prev.filter(fid => fid !== id)
                : [...prev, id];

            // Persist to IDB
            set('favorites', newFavs).then(() => {
                // Notify other tabs
                channel.postMessage('UPDATE');
            });

            return newFavs;
        });
    };

    const isFavorite = (id: string) => favorites.includes(id);

    return { favorites, toggleFavorite, isFavorite };
};

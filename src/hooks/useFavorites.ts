import { useSyncExternalStore } from 'react';
import { get, set } from 'idb-keyval';
import { migrateLegacyIds } from '../utils/legacyIds';
import { idAliases } from '../data/dictionary';

// Saved words, shared by every component in the tab. Each word card used to
// call a hook with its own copy: a page of cards read storage once per card,
// and saving two words quickly could let one card's stale copy overwrite the
// other's save. One store in this module fixes both. It lives in a module
// rather than a React provider so the dictionary data it needs is only
// loaded by pages that use saved words.

const STORAGE_KEY = 'favorites';
const CHANNEL = 'awal_favorites_sync';

interface FavoritesState {
    favorites: string[];
    /** False until the saved list has been read, so "none saved" and "not loaded yet" differ */
    loaded: boolean;
}

let state: FavoritesState = { favorites: [], loaded: false };
const listeners = new Set<() => void>();
let channel: BroadcastChannel | null = null;
let loading: Promise<void> | null = null;

const update = (next: FavoritesState) => {
    state = next;
    listeners.forEach(listener => listener());
};

const load = async () => {
    const stored: string[] = (await get(STORAGE_KEY)) ?? [];
    // Favourites saved before PDF entries had stable IDs, or pointing at an
    // entry that has since been merged into another
    const migrated = await migrateLegacyIds(stored);
    const current = [...new Set(migrated.map(id => idAliases.get(id) ?? id))];
    if (current.join() !== stored.join()) await set(STORAGE_KEY, current);
    update({ favorites: current, loaded: true });
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    loading ??= load();
    if (!channel && typeof BroadcastChannel !== 'undefined') {
        // Another tab changed the list. A channel never receives its own
        // messages, so this tab does not reload after its own saves.
        channel = new BroadcastChannel(CHANNEL);
        channel.onmessage = event => {
            if (event.data === 'UPDATE') void load();
        };
    }
    return () => {
        listeners.delete(listener);
    };
};

const getSnapshot = () => state;

export const toggleFavorite = (id: string) => {
    // A tap before the saved list has loaded would be overwritten by the load
    if (!state.loaded) {
        void (loading ??= load()).then(() => toggleFavorite(id));
        return;
    }
    const favorites = state.favorites.includes(id)
        ? state.favorites.filter(fid => fid !== id)
        : [...state.favorites, id];
    update({ ...state, favorites });
    void set(STORAGE_KEY, favorites).then(() => channel?.postMessage('UPDATE'));
};

export const useFavorites = () => {
    const { favorites, loaded } = useSyncExternalStore(subscribe, getSnapshot);
    const isFavorite = (id: string) => favorites.includes(id);
    return { favorites, loaded, toggleFavorite, isFavorite };
};

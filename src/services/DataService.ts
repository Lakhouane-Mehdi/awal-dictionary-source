// DataService.ts
// This service abstracts data operations. 
// Uses idb-keyval for async IndexedDB storage, simulating a robust SQL data layer.

import { get, set } from 'idb-keyval';

export interface ConsentRecord {
    essential: boolean;
    analytics: boolean;
    marketing: boolean;
    timestamp: string;
}

export interface UserPreferences {
    favorites: string[];
}

class DataServiceImpl {
    private readonly CONSENT_KEY = 'cookie-consent';

    // Async "SQL Insert" for Consent
    async saveConsent(consent: ConsentRecord): Promise<void> {
        console.log('[DataSQL] INSERT INTO user_consent VALUES', consent);
        // Persist to IndexedDB (Async)
        await set(this.CONSENT_KEY, consent);
        // Backup to localStorage for sync access if needed (optional, keeping purely async here)
    }

    // Async "SQL Select" for Consent
    async getConsent(): Promise<ConsentRecord | null> {
        // Query IndexedDB
        return await get<ConsentRecord>(this.CONSENT_KEY) || null;
    }

    // Future method: Sync dictionary data to IDB
    async cacheDictionary(data: unknown): Promise<void> {
        console.log('[DataSQL] INSERT INTO dictionary_cache ...');
        await set('dictionary-offline-cache', data);
    }
}

export const DataService = new DataServiceImpl();

type CacheEntry<T> = {
    value: T;
    expiresAt: number;
};

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_PREFIX = 'cache:';
const memoryCache = new Map<string, CacheEntry<unknown>>();
export async function initCacheFromStorage(): Promise<void> {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const cacheKeys = keys.filter((k: string) => k.startsWith(STORAGE_PREFIX));
        if (cacheKeys.length === 0) return;

        const items = await AsyncStorage.multiGet(cacheKeys);
        for (const [storageKey, value] of items) {
            if (!value) continue;
            try {
                const entry = JSON.parse(value) as CacheEntry<unknown>;
                const logicalKey = storageKey.replace(STORAGE_PREFIX, '');
                if (Date.now() <= entry.expiresAt) {
                    memoryCache.set(logicalKey, entry);
                } else {
                    await AsyncStorage.removeItem(storageKey);
                }
            } catch (e) {
                console.warn('Failed to parse cache entry', storageKey, e);
            }
        }
    } catch (e) {

    }
}

export function setCache<T>(key: string, value: T, ttlMs = 1000 * 60) {
    const expiresAt = Date.now() + ttlMs;
    const entry: CacheEntry<T> = { value, expiresAt };
    memoryCache.set(key, entry);

    (async () => {
        try {
            await AsyncStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(entry));
        } catch (e) {
        }
    })();
}

export function getCache<T>(key: string): T | null {
    const entry = memoryCache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
        memoryCache.delete(key);
        (async () => {
            try {
                await AsyncStorage.removeItem(STORAGE_PREFIX + key);
            } catch (e) {
            }
        })();
        return null;
    }
    return entry.value as T;
}

export function clearCache(key?: string) {
    if (key) {
        memoryCache.delete(key);
        (async () => {
            try {
                await AsyncStorage.removeItem(STORAGE_PREFIX + key);
            } catch (e) {
            }
        })();
    } else {
        memoryCache.clear();
        (async () => {
            try {
                const keys = await AsyncStorage.getAllKeys();
                const cacheKeys = keys.filter((k: string) => k.startsWith(STORAGE_PREFIX));
                if (cacheKeys.length > 0) await AsyncStorage.multiRemove(cacheKeys);
            } catch (e) {
            }
        })();
    }
}

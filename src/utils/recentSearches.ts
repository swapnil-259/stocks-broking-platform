import { getCache, setCache } from './cache';

const KEY = 'recent_searches';
const MAX = 12;

export type RecentSearch = { symbol: string; name?: string; timestamp: number };

export function getRecentSearches(): RecentSearch[] {
    const cached = getCache<RecentSearch[]>(KEY);
    return cached || [];
}

export function addRecentSearch(item: RecentSearch) {
    const list = getRecentSearches();
    const filtered = list.filter((s) => s.symbol.toLowerCase() !== item.symbol.toLowerCase());
    filtered.unshift(item);
    const sliced = filtered.slice(0, MAX);
    setCache(KEY, sliced, 1000 * 60 * 60 * 24 * 365); // keep for 1 year
}

export function clearRecentSearches() {
    setCache(KEY, [], 1000 * 60 * 60 * 24 * 365);
}

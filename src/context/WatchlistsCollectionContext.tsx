import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Stock } from '../types/stock';
import { getCache, setCache } from '../utils/cache';

type NamedLists = Record<string, Stock[]>;

interface WatchlistsCollectionContextType {
    lists: NamedLists;
    createList: (name: string) => void;
    deleteList: (name: string) => void;
    toggleStockInList: (listName: string, stock: Stock) => void;
    isInList: (listName: string, symbol: string) => boolean;
    isInAnyList: (symbol: string) => boolean;
}

const WatchlistsCollectionContext = createContext<WatchlistsCollectionContextType | undefined>(undefined);

export const WatchlistsCollectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const initial = getCache<NamedLists>('named_watchlists') ?? {};
    const [lists, setLists] = useState<NamedLists>(initial);

    useEffect(() => {
        try {
            setCache('named_watchlists', lists, 1000 * 60 * 60 * 24 * 365);
        } catch (e) {
            console.warn('Failed to persist watchlists', e);
        }
    }, [lists]);

    const createList = (name: string) => {
        setLists((prev) => ({ ...prev, [name]: prev[name] || [] }));
    };

    const deleteList = (name: string) => {
        setLists((prev) => {
            const copy = { ...prev };
            delete copy[name];
            return copy;
        });
    };

    const toggleStockInList = (listName: string, stock: Stock) => {
        setLists((prev) => {
            const list = prev[listName] || [];
            const exists = list.some((s) => s.symbol === stock.symbol);
            return {
                ...prev,
                [listName]: exists ? list.filter((s) => s.symbol !== stock.symbol) : [...list, stock],
            };
        });
    };

    const isInList = (listName: string, symbol: string) => {
        return (lists[listName] || []).some((s) => s.symbol === symbol);
    };

    const isInAnyList = (symbol: string) => {
        return Object.keys(lists).some((name) => (lists[name] || []).some((s) => s.symbol === symbol));
    };

    return (
        <WatchlistsCollectionContext.Provider value={{ lists, createList, deleteList, toggleStockInList, isInList, isInAnyList }}>
            {children}
        </WatchlistsCollectionContext.Provider>
    );
};

export const useWatchlists = () => {
    const ctx = useContext(WatchlistsCollectionContext);
    if (!ctx) throw new Error('useWatchlists must be used within WatchlistsCollectionProvider');
    return ctx;
};

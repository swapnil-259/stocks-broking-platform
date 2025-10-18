import React, { createContext, useContext, useState, ReactNode } from "react";
import { Stock } from "../types/stock";

interface WatchlistContextType {
    watchlist: Stock[];
    addToWatchlist: (stock: Stock) => void;
    removeFromWatchlist: (stock: Stock) => void;
    isInWatchlist: (symbol: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [watchlist, setWatchlist] = useState<Stock[]>([]);

    const addToWatchlist = (stock: Stock) => {
        setWatchlist((prev) => [...prev, stock]);
    };

    const removeFromWatchlist = (stock: Stock) => {
        setWatchlist((prev) => prev.filter((s) => s.symbol !== stock.symbol));
    };

    const isInWatchlist = (symbol: string) => {
        return watchlist.some((s) => s.symbol === symbol);
    };

    return (
        <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
            {children}
        </WatchlistContext.Provider>
    );
};

export const useWatchlist = (): WatchlistContextType => {
    const context = useContext(WatchlistContext);
    if (!context) throw new Error("useWatchlist must be used within WatchlistProvider");
    return context;
};

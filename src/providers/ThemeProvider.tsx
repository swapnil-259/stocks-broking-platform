import React, { createContext, useContext, useState, useEffect } from "react";
import { View } from "react-native";
import { StatusBar } from 'react-native';
import { colorScheme } from "nativewind";
import { themes } from "../utils/color-theme";
import { getCache, setCache } from '../utils/cache';

interface ThemeProviderProps {
    children: React.ReactNode;
}

type ThemeContextType = {
    theme: "light" | "dark";
    toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    toggleTheme: () => { },
});

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const persisted = getCache<'light' | 'dark'>('app_theme');
    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(persisted ?? 'light');
    useEffect(() => {
        colorScheme.set(currentTheme);
    }, [currentTheme]);

    const toggleTheme = () => {
        const newTheme = currentTheme === "light" ? "dark" : "light";
        setCurrentTheme(newTheme);
        setCache('app_theme', newTheme, 1000 * 60 * 60 * 24 * 365);
        colorScheme.set(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
            <StatusBar barStyle={currentTheme === "dark" ? "light-content" : "dark-content"} />
            <View style={themes[currentTheme]} className="flex-1">
                {children}
            </View>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
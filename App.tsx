import './global.css';
import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './src/providers/ThemeProvider';
import AppNavigator from './src/navigation/AppNavigator';
import { WatchlistProvider } from './src/context/WatchListContext';
import { WatchlistsCollectionProvider } from './src/context/WatchlistsCollectionContext';
import { initCacheFromStorage } from './src/utils/cache';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from './src/providers/ThemeProvider';
import { colorTokens } from './src/utils/color-theme';


export default function App() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    initCacheFromStorage().finally(() => setHydrated(true));
  }, []);

  if (!hydrated) {
    const theme = 'light' as const;
    const tokens = colorTokens[theme];
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: tokens.background }}>
        <ActivityIndicator size="large" color={tokens.primary} />
      </View>
    );
  }
  return (
    <ThemeProvider>
      <WatchlistsCollectionProvider>
        <WatchlistProvider>
          <AppNavigator />
        </WatchlistProvider>
      </WatchlistsCollectionProvider>
    </ThemeProvider>
  );
}
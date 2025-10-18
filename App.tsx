import './global.css';
import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './src/providers/ThemeProvider';
import AppNavigator from './src/navigation/AppNavigator';
import { WatchlistProvider } from './src/context/WatchListContext';
import { WatchlistsCollectionProvider } from './src/context/WatchlistsCollectionContext';
import { initCacheFromStorage } from './src/utils/cache';
import { ActivityIndicator, View } from 'react-native';


export default function App() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    initCacheFromStorage().finally(() => setHydrated(true));
  }, []);

  if (!hydrated) {
    return (<View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" />
    </View>);
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
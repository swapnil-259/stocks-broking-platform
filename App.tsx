import './global.css';
import React from 'react';
import { ThemeProvider } from './src/providers/ThemeProvider';
import AppNavigator from './src/navigation/AppNavigator';
import { WatchlistProvider } from './src/context/WatchListContext';

export default function App() {
  return (
    <ThemeProvider>
      <WatchlistProvider>
        <AppNavigator />
      </WatchlistProvider>
    </ThemeProvider>
  );
}
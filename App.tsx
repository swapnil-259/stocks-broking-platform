import './global.css';
import React from 'react';
import { ThemeProvider } from './src/providers/ThemeProvider';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}
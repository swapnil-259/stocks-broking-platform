import './global.css';
import React from 'react';
import { View, Text } from 'react-native';
import { ThemeProvider } from './src/providers/ThemeProvider';
import ThemeToggle from './src/components/ThemeToggle';

const AppContent = () => {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-text text-2xl font-bold mb-4">Hello Toggle</Text>
      <ThemeToggle />
    </View>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
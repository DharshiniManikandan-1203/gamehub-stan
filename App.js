import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FavoritesProvider } from './src/context/FavoritesContext';
import AppNavigator from './src/navigation/AppNavigator';

/**
 * GameHub Root Component
 * 
 * Sets up global context providers:
 * 1. SafeAreaProvider: Ensures safe insets handling across all notch and punch-hole devices.
 * 2. FavoritesProvider: Provides shared persisted favorites state to all screens.
 * 3. AppNavigator: Handles screen navigation (Home -> Game Details -> Favorites).
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <FavoritesProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </FavoritesProvider>
    </SafeAreaProvider>
  );
}

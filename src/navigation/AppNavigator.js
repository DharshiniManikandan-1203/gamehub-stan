import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import GameDetailsScreen from '../screens/GameDetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator();

// Custom Dark Navigation Theme matching GameHub design system
const customNavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: COLORS.background,
    card: COLORS.surface,
    text: COLORS.textPrimary,
    border: COLORS.surfaceBorder,
    primary: COLORS.primary,
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={customNavigationTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="GameDetails"
          component={GameDetailsScreen}
          options={{
            animation: 'fade_from_bottom',
          }}
        />
        <Stack.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

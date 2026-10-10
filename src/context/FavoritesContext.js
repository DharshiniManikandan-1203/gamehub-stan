import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_STORAGE_KEY = '@gamehub_favorites_v1';

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

  useEffect(() => {
    const loadPersistedFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setFavorites(parsed);
          }
        }
      } catch (error) {
        console.error('Failed to load favorites from storage:', error);
      } finally {
        setIsLoadingFavorites(false);
      }
    };

    loadPersistedFavorites();
  }, []);

  const saveToStorage = async (updatedList) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedList));
    } catch (error) {
      console.error('Failed to persist favorites to storage:', error);
    }
  };

  const isFavorite = useCallback(
    (gameId) => {
      return favorites.some((game) => game.id === gameId);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (game) => {
      if (!game || !game.id) return;

      setFavorites((prev) => {
        const exists = prev.some((item) => item.id === game.id);
        let updated;
        if (exists) {
          updated = prev.filter((item) => item.id !== game.id);
        } else {
          updated = [game, ...prev];
        }
        saveToStorage(updated);
        return updated;
      });
    },
    []
  );

  const removeFavorite = useCallback(
    async (gameId) => {
      setFavorites((prev) => {
        const updated = prev.filter((item) => item.id !== gameId);
        saveToStorage(updated);
        return updated;
      });
    },
    []
  );

  const clearFavorites = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
      setFavorites([]);
    } catch (error) {
      console.error('Failed to clear favorites storage:', error);
    }
  }, []);

  const value = {
    favorites,
    favoriteCount: favorites.length,
    isLoadingFavorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useFavorites } from '../context/FavoritesContext';
import GameCard from '../components/GameCard';
import EmptyState from '../components/EmptyState';

/**
 * Screen C: Favorites Screen
 * 
 * Displays all games favorited by the user with:
 * 1. Header with back navigation, title, count badge, and optional "Clear All" action.
 * 2. FlatList rendering saved games.
 * 3. Tap to view Game Details.
 * 4. Immediate removal when unfavorited.
 * 5. Meaningful Empty State with "Explore Games" CTA when no favorites exist.
 */
export default function FavoritesScreen({ navigation }) {
  const { favorites, favoriteCount, toggleFavorite, clearFavorites, isFavorite } = useFavorites();

  const handleGamePress = useCallback(
    (game) => {
      navigation.navigate('GameDetails', { gameId: game.id, gameTitle: game.name });
    },
    [navigation]
  );

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Favorites',
      'Are you sure you want to remove all saved games from your favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearFavorites },
      ]
    );
  };

  const renderGameItem = useCallback(
    ({ item }) => (
      <GameCard
        game={item}
        isFavorite={isFavorite(item.id)}
        onToggleFavorite={toggleFavorite}
        onPress={() => handleGamePress(item)}
      />
    ),
    [isFavorite, toggleFavorite, handleGamePress]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            accessibilityLabel="Go back to Home"
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>

          <View>
            <View style={styles.titleRow}>
              <Text style={styles.headerTitle}>Favorites</Text>
              {favoriteCount > 0 && (
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{favoriteCount}</Text>
                </View>
              )}
            </View>
            <Text style={styles.headerSubtitle}>Your saved casual games</Text>
          </View>
        </View>

        {favoriteCount > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearAll}
            activeOpacity={0.7}
          >
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main List / Empty State */}
      <FlatList
        data={favorites}
        keyExtractor={keyExtractor}
        renderItem={renderGameItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="heart-outline"
            title="No Favorite Games Yet"
            message="You haven't saved any games to your favorites. Tap the heart icon on any game card to bookmark it here!"
            actionLabel="Discover Games"
            onAction={() => navigation.navigate('Home')}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceBorder,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  countBadge: {
    backgroundColor: COLORS.heart,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  clearButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
  },
  clearButtonText: {
    color: COLORS.error,
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
    flexGrow: 1,
  },
});

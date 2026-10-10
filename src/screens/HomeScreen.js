import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { fetchGames, fetchCategories } from '../services/gameService';
import { useFavorites } from '../context/FavoritesContext';

import SearchBar from '../components/SearchBar';
import CategoryChip from '../components/CategoryChip';
import GameCard from '../components/GameCard';
import EmptyState from '../components/EmptyState';

/**
 * Header Component
 */
function Header({ onFavoritesPress }) {
  const { favoriteCount } = useFavorites();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.brandContainer}>
        <View style={styles.brandIconWrapper}>
          <Ionicons name="game-controller" size={24} color={COLORS.primary} />
        </View>
        <View>
          <Text style={styles.brandTitle}>
            Game<Text style={styles.brandTitleHighlight}>Hub</Text>
          </Text>
          <Text style={styles.brandSubtitle}>Discover casual games</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.headerFavoritesButton}
        onPress={onFavoritesPress}
        activeOpacity={0.7}
        accessibilityLabel="View Favorites"
        accessibilityRole="button"
      >
        <Ionicons
          name={favoriteCount > 0 ? "heart" : "heart-outline"}
          size={22}
          color={favoriteCount > 0 ? COLORS.heart : COLORS.textPrimary}
        />
        {favoriteCount > 0 && (
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>
              {favoriteCount > 99 ? '99+' : favoriteCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

/**
 * LoadingSkeleton Component
 */
function LoadingSkeleton() {
  return (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3].map((key) => (
        <View key={key} style={styles.skeletonCard}>
          <View style={styles.skeletonImagePlaceholder} />
          <View style={styles.skeletonContentPlaceholder}>
            <View style={styles.skeletonTitleLine} />
            <View style={styles.skeletonDescLine} />
            <View style={styles.skeletonDescLineShort} />
          </View>
        </View>
      ))}
    </View>
  );
}

/**
 * ErrorState Component
 */
function ErrorState({ message, onRetry }) {
  return (
    <View style={styles.errorContainer}>
      <View style={styles.errorIconCircle}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
      </View>
      <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
      <Text style={styles.errorMessage}>{message || 'Unable to load games. Please try again.'}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.8}>
          <Ionicons name="refresh" size={18} color="#FFFFFF" />
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/**
 * Main Discovery Screen: HomeScreen
 */
export default function HomeScreen({ navigation }) {
  const { isFavorite, toggleFavorite } = useFavorites();

  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Load categories on initial render
  useEffect(() => {
    const cats = fetchCategories();
    setCategories(cats);
  }, []);

  // Fetch games based on selected category and search query
  const loadGames = useCallback(async (showSkeleton = true) => {
    if (showSkeleton) setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await fetchGames({
        category: selectedCategory,
        search: searchQuery,
      });
      setGames(data);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to load games');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedCategory, searchQuery]);

  // Trigger data fetch when category or search changes
  useEffect(() => {
    loadGames(true);
  }, [loadGames]);

  // Pull-to-refresh handler
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadGames(false);
  }, [loadGames]);

  // Navigation handlers
  const handleGamePress = useCallback((game) => {
    navigation.navigate('GameDetails', { gameId: game.id, gameTitle: game.name });
  }, [navigation]);

  const handleFavoritesPress = useCallback(() => {
    navigation.navigate('Favorites');
  }, [navigation]);

  // Search input handlers
  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // Render individual game card (memoized renderItem)
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

      {/* 1. App Header with branding & favorites badge */}
      <Header onFavoritesPress={handleFavoritesPress} />

      {/* 2. Instant Search Input */}
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearchChange}
        onClear={handleClearSearch}
      />

      {/* 3. Category Filter Chips (Horizontal Scroll) */}
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {categories.map((category) => (
            <CategoryChip
              key={category}
              label={category}
              isSelected={selectedCategory === category}
              onPress={() => handleCategorySelect(category)}
            />
          ))}
        </ScrollView>
      </View>

      {/* 4. Games List / Loading / Error / Empty States */}
      <View style={styles.listContainer}>
        {isLoading ? (
          <LoadingSkeleton />
        ) : errorMessage ? (
          <ErrorState message={errorMessage} onRetry={() => loadGames(true)} />
        ) : (
          <FlatList
            data={games}
            keyExtractor={keyExtractor}
            renderItem={renderGameItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            initialNumToRender={4}
            maxToRenderPerBatch={4}
            windowSize={5}
            removeClippedSubviews={true}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={COLORS.primary}
                colors={[COLORS.primary]}
              />
            }
            ListEmptyComponent={
              <EmptyState
                icon="game-controller-outline"
                title="No Games Found"
                message={
                  searchQuery.length > 0
                    ? `No matches for "${searchQuery}". Try a different keyword or category.`
                    : `No games currently found in ${selectedCategory}.`
                }
                actionLabel={searchQuery || selectedCategory !== 'All' ? 'Reset Filters' : undefined}
                onAction={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  brandIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  brandTitleHighlight: {
    color: COLORS.primaryLight,
  },
  brandSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  headerFavoritesButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    position: 'relative',
  },
  headerBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.heart,
    borderRadius: BORDER_RADIUS.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  headerBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  categoryContainer: {
    paddingVertical: SPACING.xs,
  },
  categoryScrollContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xl,
  },
  skeletonContainer: {
    paddingVertical: SPACING.sm,
  },
  skeletonCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  skeletonImagePlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: COLORS.surfaceLight,
  },
  skeletonContentPlaceholder: {
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  skeletonTitleLine: {
    width: '60%',
    height: 20,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surfaceLight,
  },
  skeletonDescLine: {
    width: '90%',
    height: 14,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surfaceLight,
  },
  skeletonDescLineShort: {
    width: '45%',
    height: 14,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surfaceLight,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl * 2,
  },
  errorIconCircle: {
    width: 96,
    height: 96,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.2)',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md - 2,
    borderRadius: BORDER_RADIUS.md,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

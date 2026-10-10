import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { fetchGameById } from '../services/gameService';
import { useFavorites } from '../context/FavoritesContext';

function RatingBadge({ rating, size = 'small' }) {
  const isLarge = size === 'large';
  return (
    <View style={[styles.ratingBadge, isLarge && styles.ratingBadgeLarge]}>
      <Ionicons name="star" size={isLarge ? 16 : 12} color={COLORS.star} />
      <Text style={[styles.ratingBadgeText, isLarge && styles.ratingBadgeTextLarge]}>
        {Number(rating).toFixed(1)}
      </Text>
    </View>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <View style={styles.errorContainer}>
      <View style={styles.errorIconCircle}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
      </View>
      <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
      <Text style={styles.errorMessage}>{message || 'Game details could not be found.'}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.8}>
          <Ionicons name="refresh" size={18} color="#FFFFFF" />
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/**
 * Screen B: Game Details Screen
 * 
 * Displays:
 * 1. Large hero image with back button & quick favorite toggle.
 * 2. Game name, category pill, and rating score.
 * 3. Additional metadata: Difficulty, Players, Release Year, Developer.
 * 4. Full storyline & gameplay description.
 * 5. Primary favorite toggle action button with real-time state synchronization.
 */
export default function GameDetailsScreen({ route, navigation }) {
  const { gameId } = route.params || {};
  const { isFavorite, toggleFavorite } = useFavorites();

  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch full game details by ID
  useEffect(() => {
    const loadGameDetails = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const data = await fetchGameById(gameId);
        setGame(data);
      } catch (error) {
        setErrorMessage(error.message || 'Game details could not be found.');
      } finally {
        setIsLoading(false);
      }
    };

    if (gameId) {
      loadGameDetails();
    }
  }, [gameId]);

  const isFavorited = game ? isFavorite(game.id) : false;

  const handleToggleFavorite = () => {
    if (game) {
      toggleFavorite(game);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading game details...</Text>
      </View>
    );
  }

  if (errorMessage || !game) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={handleBack} style={styles.navButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
        <ErrorState message={errorMessage} onRetry={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Large Hero Image with Floating Navigation Buttons */}
        <View style={styles.heroImageContainer}>
          <Image source={{ uri: game.image }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.imageOverlay} />

          {/* Floating Top Navigation Header */}
          <SafeAreaView style={styles.floatingNavHeader} edges={['top']}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={handleBack}
              activeOpacity={0.8}
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navButton, isFavorited && styles.navButtonFavorited]}
              onPress={handleToggleFavorite}
              activeOpacity={0.8}
              accessibilityLabel={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Ionicons
                name={isFavorited ? 'heart' : 'heart-outline'}
                size={22}
                color={isFavorited ? COLORS.heart : COLORS.textPrimary}
              />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* 2. Main Content Card */}
        <View style={styles.mainContent}>
          {/* Category & Rating Row */}
          <View style={styles.metaHeaderRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{game.category}</Text>
            </View>
            <RatingBadge rating={game.rating} size="large" />
          </View>

          {/* Title */}
          <Text style={styles.gameTitle}>{game.name}</Text>
          <Text style={styles.developerText}>by {game.developer || 'Indie Creator'}</Text>

          {/* 3. Key Specifications / Additional Information Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="people" size={20} color={COLORS.primaryLight} />
              <Text style={styles.statLabel}>Players</Text>
              <Text style={styles.statValue}>{game.players}</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="speedometer" size={20} color={COLORS.star} />
              <Text style={styles.statLabel}>Difficulty</Text>
              <Text style={styles.statValue}>{game.difficulty}</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="calendar" size={20} color={COLORS.success} />
              <Text style={styles.statLabel}>Released</Text>
              <Text style={styles.statValue}>{game.releaseYear}</Text>
            </View>
          </View>

          {/* 4. Description Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this Game</Text>
            <Text style={styles.descriptionText}>
              {game.longDescription || game.description}
            </Text>
          </View>

          {/* 5. Tags Section */}
          {game.tags && game.tags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags & Genres</Text>
              <View style={styles.tagChipsContainer}>
                {game.tags.map((tag) => (
                  <View key={tag} style={styles.tagChip}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 6. Sticky Bottom Action Bar */}
      <SafeAreaView style={styles.bottomBar} edges={['bottom']}>
        <TouchableOpacity
          style={[
            styles.favoriteActionButton,
            isFavorited ? styles.favoriteActionButtonActive : styles.favoriteActionButtonInactive,
          ]}
          onPress={handleToggleFavorite}
          activeOpacity={0.85}
        >
          <Ionicons
            name={isFavorited ? 'heart' : 'heart-outline'}
            size={20}
            color={isFavorited ? '#FFFFFF' : COLORS.textPrimary}
          />
          <Text style={[styles.favoriteActionText, isFavorited && styles.favoriteActionTextActive]}>
            {isFavorited ? 'In Favorites (Tap to Remove)' : 'Add to Favorites'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 15,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Padding for sticky bottom button
  },
  heroImageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
    backgroundColor: COLORS.surfaceLight,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 15, 25, 0.35)',
  },
  floatingNavHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(11, 15, 25, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  navButtonFavorited: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    borderColor: COLORS.heart,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.background,
    marginTop: -24, // Pull up over hero image
  },
  metaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  categoryBadge: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  categoryText: {
    color: COLORS.primaryLight,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gameTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 32,
    marginBottom: 4,
  },
  developerText: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: SPACING.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    marginBottom: 2,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  descriptionText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  tagChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  tagChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  tagText: {
    color: COLORS.primaryLight,
    fontSize: 12,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceBorder,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  favoriteActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  favoriteActionButtonActive: {
    backgroundColor: COLORS.heart,
  },
  favoriteActionButtonInactive: {
    backgroundColor: COLORS.primary,
  },
  favoriteActionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  favoriteActionTextActive: {
    color: '#FFFFFF',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
    gap: 4,
  },
  ratingBadgeLarge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.md,
    gap: 6,
  },
  ratingBadgeText: {
    color: COLORS.star,
    fontSize: 12,
    fontWeight: '700',
  },
  ratingBadgeTextLarge: {
    fontSize: 15,
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

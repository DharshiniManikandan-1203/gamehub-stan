import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useFavorites } from '../context/FavoritesContext';

/**
 * Header Component
 * 
 * Displays the app branding ("GameHub") with a gaming controller icon
 * and a quick-action button on the right navigating to the Favorites screen.
 * Shows a live badge counter when items are in favorites.
 */
export default function Header({ onFavoritesPress }) {
  const { favoriteCount } = useFavorites();

  return (
    <View style={styles.container}>
      {/* App Logo & Title */}
      <View style={styles.brandContainer}>
        <View style={styles.iconWrapper}>
          <Ionicons name="game-controller" size={24} color={COLORS.primary} />
        </View>
        <View>
          <Text style={styles.title}>
            Game<Text style={styles.titleHighlight}>Hub</Text>
          </Text>
          <Text style={styles.subtitle}>Discover casual games</Text>
        </View>
      </View>

      {/* Favorites Navigation Action Button */}
      <TouchableOpacity
        style={styles.favoritesButton}
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
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {favoriteCount > 99 ? '99+' : favoriteCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  titleHighlight: {
    color: COLORS.primaryLight,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  favoritesButton: {
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
  badge: {
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
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
});

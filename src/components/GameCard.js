import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';


/**
 * GameCard Component
 * 
 * Displays individual game card with:
 * - Thumbnail image
 * - Category pill tag
 * - Rating badge
 * - Game Title
 * - Short Description
 * - Direct Favorite/Unfavorite heart button
 * 
 * Memoized with React.memo to prevent unnecessary re-renders during FlatList scrolling.
 */
function RatingBadge({ rating }) {
  return (
    <View style={styles.ratingBadge}>
      <Ionicons name="star" size={12} color={COLORS.star} />
      <Text style={styles.ratingText}>{Number(rating).toFixed(1)}</Text>
    </View>
  );
}

function GameCard({ game, isFavorite, onToggleFavorite, onPress }) {
  const handleFavoritePress = (e) => {
    // Trigger favorite toggle callback
    onToggleFavorite(game);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.88}
      accessibilityRole="button"
      accessibilityLabel={`Open details for ${game.name}`}
    >
      {/* Thumbnail with Category & Rating Overlay */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: game.image }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        {/* Category Pill Tag Overlay */}
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>{game.category}</Text>
        </View>

        {/* Rating Badge Overlay */}
        <View style={styles.ratingOverlay}>
          <RatingBadge rating={game.rating} />
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {game.name}
          </Text>

          {/* Quick Favorite Action Button */}
          <TouchableOpacity
            style={[
              styles.favoriteBtn,
              isFavorite && styles.favoriteBtnActive,
            ]}
            onPress={handleFavoritePress}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel={isFavorite ? `Unfavorite ${game.name}` : `Favorite ${game.name}`}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? COLORS.heart : COLORS.textMuted}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {game.description}
        </Text>

        {/* Footer info: Difficulty & Players */}
        <View style={styles.footerRow}>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={13} color={COLORS.textMuted} />
            <Text style={styles.metaText}>{game.players}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="speedometer-outline" size={13} color={COLORS.textMuted} />
            <Text style={styles.metaText}>{game.difficulty}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  imageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
    backgroundColor: COLORS.surfaceLight,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  categoryPill: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: 'rgba(11, 15, 25, 0.85)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryText: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ratingOverlay: {
    position: 'absolute',
    bottom: SPACING.sm,
    right: SPACING.sm,
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
  ratingText: {
    color: COLORS.star,
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    padding: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: SPACING.sm,
  },
  favoriteBtn: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteBtnActive: {
    backgroundColor: COLORS.heartBg,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
});

export default React.memo(GameCard);

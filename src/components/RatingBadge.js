import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

/**
 * RatingBadge Component
 * 
 * Reusable badge showing a star icon and numeric rating.
 */
export default function RatingBadge({ rating, size = 'small' }) {
  const isLarge = size === 'large';

  return (
    <View style={[styles.container, isLarge && styles.containerLarge]}>
      <Ionicons name="star" size={isLarge ? 16 : 12} color={COLORS.star} />
      <Text style={[styles.ratingText, isLarge && styles.ratingTextLarge]}>
        {Number(rating).toFixed(1)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
    gap: 4,
  },
  containerLarge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.md,
    gap: 6,
  },
  ratingText: {
    color: COLORS.star,
    fontSize: 12,
    fontWeight: '700',
  },
  ratingTextLarge: {
    fontSize: 15,
  },
});

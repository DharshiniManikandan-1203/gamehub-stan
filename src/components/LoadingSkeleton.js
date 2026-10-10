import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

/**
 * LoadingSkeleton Component
 * 
 * Displays placeholder card skeletons while games data is being fetched asynchronously.
 */
export default function LoadingSkeleton() {
  return (
    <View style={styles.container}>
      {[1, 2, 3].map((key) => (
        <View key={key} style={styles.cardSkeleton}>
          <View style={styles.imagePlaceholder} />
          <View style={styles.contentPlaceholder}>
            <View style={styles.titleLine} />
            <View style={styles.descLine} />
            <View style={styles.descLineShort} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.sm,
  },
  cardSkeleton: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  imagePlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: COLORS.surfaceLight,
  },
  contentPlaceholder: {
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  titleLine: {
    width: '60%',
    height: 20,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surfaceLight,
  },
  descLine: {
    width: '90%',
    height: 14,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surfaceLight,
  },
  descLineShort: {
    width: '45%',
    height: 14,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surfaceLight,
  },
});

import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

/**
 * CategoryChip Component
 * 
 * Reusable horizontal filter pill. Highlights when active.
 */
export default function CategoryChip({ label, isSelected, onPress }) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        isSelected ? styles.chipActive : styles.chipInactive,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
    >
      <Text
        style={[
          styles.label,
          isSelected ? styles.labelActive : styles.labelInactive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryLight,
  },
  chipInactive: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surfaceBorder,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  labelActive: {
    color: '#FFFFFF',
  },
  labelInactive: {
    color: COLORS.textSecondary,
  },
});

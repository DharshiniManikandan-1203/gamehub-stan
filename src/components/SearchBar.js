import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

/**
 * SearchBar Component
 * 
 * Reusable search input with search icon, text input handling,
 * and a one-tap clear button when text is present.
 */
export default function SearchBar({ value, onChangeText, onClear, placeholder = 'Search games by name...' }) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="never" // Custom clear button for cross-platform consistency
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={onClear}
          style={styles.clearButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Clear search text"
        >
          <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    paddingHorizontal: SPACING.md,
    height: 48,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.xs,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 15,
    paddingVertical: 0, // Avoid Android default vertical padding
  },
  clearButton: {
    padding: SPACING.xs,
  },
});

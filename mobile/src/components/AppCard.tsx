import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { colors, spacing } from '@/theme/tokens';

interface Props {
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const AppCard: React.FC<Props> = ({ title, children, style }) => (
  <Surface style={[styles.card, style]} elevation={1}>
    {title ? (
      <Text style={styles.title} variant="titleMedium">
        {title}
      </Text>
    ) : null}
    <View>{children}</View>
  </Surface>
);

const styles = StyleSheet.create({
  card: {
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  title: {
    marginBottom: spacing.xs,
    color: colors.text,
    fontWeight: '600',
  },
});

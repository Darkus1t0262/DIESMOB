import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { colors, spacing } from '@/theme/tokens';

interface Props<T extends string> {
  value: T;
  options: { label: string; value: T }[];
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({ value, options, onChange }: Props<T>) {
  return (
    <View style={styles.container}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <Button
            key={opt.value}
            mode={active ? 'contained' : 'outlined'}
            onPress={() => onChange(opt.value)}
            style={[styles.button, active && styles.active]}
            textColor={active ? '#fff' : colors.text}
            compact
          >
            {opt.label}
          </Button>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  button: {
    flex: 1,
    height: 44,
    borderRadius: 10,
  },
  active: {
    borderColor: colors.primary,
  },
});

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { AppCard } from './AppCard';
import { colors, spacing } from '@/theme/tokens';

interface Props {
  label: string;
  value: string | number;
  subtitle?: string;
  tone?: 'primary' | 'success' | 'warning' | 'danger';
}

export const KPICard: React.FC<Props> = ({ label, value, subtitle, tone = 'primary' }) => {
  const color = tone === 'primary' ? colors.primary : tone === 'success' ? colors.success : tone === 'warning' ? colors.warning : colors.danger;
  return (
    <AppCard style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <Text style={[styles.value, { color }]}>{value}</Text>
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
  },
  subtitle: {
    marginTop: spacing.xs,
    color: colors.muted,
  },
});

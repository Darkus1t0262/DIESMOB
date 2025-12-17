import React from 'react';
import { Chip } from 'react-native-paper';
import { colors } from '@/theme/tokens';

interface Props {
  label: string;
  tone?: 'success' | 'warning' | 'danger' | 'info';
}

const toneMap = {
  success: colors.success,
  warning: colors.warning,
  danger: colors.danger,
  info: colors.info,
};

export const StatusBadge: React.FC<Props> = ({ label, tone = 'info' }) => (
  <Chip compact style={{ backgroundColor: toneMap[tone] + '22' }} textStyle={{ color: toneMap[tone], fontWeight: '600' }}>
    {label}
  </Chip>
);

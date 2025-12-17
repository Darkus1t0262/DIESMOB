import React from 'react';
import { Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';

interface Props {
  label: string;
  onPress: () => void;
  mode?: 'contained' | 'outlined' | 'text';
  disabled?: boolean;
  icon?: string;
}

export const PrimaryButton: React.FC<Props> = ({ label, onPress, mode = 'contained', disabled, icon }) => (
  <Button mode={mode} icon={icon} onPress={onPress} disabled={disabled} style={styles.button} contentStyle={styles.content}>
    {label}
  </Button>
);

const styles = StyleSheet.create({
  button: {
    marginVertical: 4,
  },
  content: {
    height: 48,
  },
});

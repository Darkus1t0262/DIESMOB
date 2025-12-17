import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { colors } from './tokens';

export const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
    error: colors.danger,
    secondary: colors.purple,
  },
  roundness: 10,
};

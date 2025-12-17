import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, HelperText } from 'react-native-paper';
import { colors, spacing, typography } from '@/theme/tokens';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAuth } from '@/app/AuthContext';

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    if (!username || !password) {
      setError('Ingrese usuario y contraseña');
      return;
    }
    setLoading(true);
    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.hero}>
        <Text style={styles.title}>EcoCombustible Regulador</Text>
        <Text style={styles.subtitle}>Panel de Supervisión</Text>
      </View>
      <View style={styles.form}>
        <TextInput label="Usuario" value={username} onChangeText={setUsername} mode="outlined" style={styles.input} />
        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
        />
        {error ? <HelperText type="error">{error}</HelperText> : null}
        <PrimaryButton label={loading ? 'Ingresando...' : 'Ingresar'} onPress={handleSubmit} disabled={loading} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.h1.fontSize,
    lineHeight: typography.h1.lineHeight,
    color: colors.primary,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: spacing.xs,
    color: colors.muted,
  },
  form: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    elevation: 2,
  },
  input: {
    marginBottom: spacing.sm,
  },
});

export default LoginScreen;

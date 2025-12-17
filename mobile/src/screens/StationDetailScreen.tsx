import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { AppCard } from '@/components/AppCard';
import { StatusBadge } from '@/components/StatusBadge';
import { api } from '@/services/api';
import { ComplianceStatus, Station } from '@/types';
import { colors, spacing } from '@/theme/tokens';

const statusToTone: Record<ComplianceStatus, 'success' | 'warning' | 'danger'> = {
  Complies: 'success',
  Observation: 'warning',
  Infraction: 'danger',
};

const StationDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<{ params: { id: string } }, 'params'>>();
  const [station, setStation] = useState<Station | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getStationById(route.params.id)
      .then(setStation)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [route.params.id]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: spacing.lg }} />;
  }
  if (error || !station) {
    return <Text style={{ margin: spacing.md, color: colors.danger }}>No se encontró la estación.</Text>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <AppCard>
        <Text variant="headlineMedium">{station.name}</Text>
        <Text style={styles.meta}>{station.city}, {station.province}</Text>
        <StatusBadge label={station.complianceStatus} tone={statusToTone[station.complianceStatus]} />
        <Text style={styles.meta}>Última auditoría {station.lastAuditDate}</Text>
      </AppCard>

      <AppCard title="Precios y ventas">
        {station.fuels.map((fuel) => (
          <View key={fuel.type} style={styles.fuelRow}>
            <Text style={styles.fuelType}>{fuel.type}</Text>
            <Text style={styles.fuelPrice}>${fuel.price.toFixed(2)}</Text>
            <Text style={styles.fuelVolume}>{fuel.dailyLitersSold.toLocaleString()} L/día</Text>
          </View>
        ))}
      </AppCard>

      <AppCard title="Acciones rápidas">
        <Text style={styles.meta}>Iniciar auditoría simulada, actualizar precios o enviar alerta.</Text>
      </AppCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  meta: {
    color: colors.muted,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  fuelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  fuelType: {
    fontWeight: '600',
  },
  fuelPrice: {
    color: colors.text,
  },
  fuelVolume: {
    color: colors.muted,
  },
});

export default StationDetailScreen;

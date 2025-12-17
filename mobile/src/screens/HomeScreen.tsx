import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { AppCard } from '@/components/AppCard';
import { KPICard } from '@/components/KPICard';
import { colors, spacing } from '@/theme/tokens';
import { api } from '@/services/api';
import { Station, Complaint, Audit } from '@/types';
import { useNavigation } from '@react-navigation/native';

const HomeScreen: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const isLarge = useWindowDimensions().width >= 900;

  useEffect(() => {
    const load = async () => {
      try {
        const [st, cmp, aud] = await Promise.all([api.getStations(), api.getComplaints(), api.getAudits()]);
        setStations(st);
        setComplaints(cmp);
        setAudits(aud);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const moduleCards = [
    { label: 'Estaciones', screen: 'Estaciones' },
    { label: 'Denuncias', screen: 'Denuncias' },
    { label: 'Auditorías remotas', screen: 'Auditorías' },
    { label: 'Reportes', screen: 'Reportes' },
    { label: 'Mapa de estaciones', screen: 'Mapa' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <Text variant="headlineLarge" style={styles.title}>
        Panel general
      </Text>
      {loading ? <ActivityIndicator animating /> : null}
      <View style={[styles.kpiRow, { flexDirection: isLarge ? 'row' : 'column' }]}>
        <KPICard label="Estaciones activas" value={stations.length} tone="primary" />
        <KPICard label="Denuncias pendientes" value={complaints.filter((c) => c.status === 'Pending').length} tone="warning" />
        <KPICard label="Auditorías del mes" value={audits.length} tone="success" />
      </View>

      <View style={[styles.grid, { flexDirection: isLarge ? 'row' : 'column', flexWrap: 'wrap' }]}>
        {moduleCards.map((card) => (
          <AppCard key={card.label} style={[styles.card, { width: isLarge ? '45%' : '100%' }]}> 
            <Text style={styles.cardTitle}>{card.label}</Text>
            <Text style={styles.cardBody}>Explorar módulo</Text>
            <Text style={styles.link} onPress={() => navigation.navigate(card.screen as never)}>
              Ir
            </Text>
          </AppCard>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    color: colors.text,
    marginBottom: spacing.md,
  },
  kpiRow: {
    gap: spacing.sm,
  },
  grid: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  card: {
    minHeight: 120,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cardBody: {
    color: colors.muted,
  },
  link: {
    marginTop: spacing.sm,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default HomeScreen;

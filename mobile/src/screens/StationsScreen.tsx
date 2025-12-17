import React, { useEffect, useMemo, useState } from 'react';
import { View, FlatList, StyleSheet, useWindowDimensions } from 'react-native';
import { ActivityIndicator, List, Text, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AppCard } from '@/components/AppCard';
import { StatusBadge } from '@/components/StatusBadge';
import { colors, spacing } from '@/theme/tokens';
import { api } from '@/services/api';
import { ComplianceStatus, Station } from '@/types';
import { SegmentedControl } from '@/components/SegmentedControl';

const statusToTone: Record<ComplianceStatus, 'success' | 'warning' | 'danger'> = {
  Complies: 'success',
  Observation: 'warning',
  Infraction: 'danger',
};

const StationsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | ComplianceStatus>('all');
  const isLarge = useWindowDimensions().width >= 900;

  useEffect(() => {
    api
      .getStations()
      .then(setStations)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return stations.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filter === 'all' ? true : s.complianceStatus === filter;
      return matchesSearch && matchesStatus;
    });
  }, [stations, search, filter]);

  const renderItem = ({ item }: { item: Station }) => (
    <AppCard style={{ marginRight: isLarge ? spacing.sm : 0 }}>
      <List.Item
        title={item.name}
        description={`${item.city}, ${item.province}`}
        right={() => <StatusBadge label={item.complianceStatus} tone={statusToTone[item.complianceStatus]} />}
      />
      <Text style={styles.meta}>Última auditoría: {item.lastAuditDate}</Text>
      <Text style={styles.link} onPress={() => navigation.navigate('StationDetail' as never, { id: item.id } as never)}>
        Ver detalles
      </Text>
    </AppCard>
  );

  return (
    <View style={[styles.container, { padding: spacing.md }]}> 
      <Text variant="headlineMedium" style={{ marginBottom: spacing.sm }}>
        Estaciones
      </Text>
      <TextInput
        placeholder="Buscar por nombre o ciudad"
        value={search}
        onChangeText={setSearch}
        left={<TextInput.Icon icon="magnify" />}
        style={{ marginBottom: spacing.sm }}
      />
      <SegmentedControl
        value={filter}
        options={[
          { label: 'Todas', value: 'all' },
          { label: 'Compliant', value: 'Complies' as ComplianceStatus },
          { label: 'Observación', value: 'Observation' as ComplianceStatus },
          { label: 'Infracción', value: 'Infraction' as ComplianceStatus },
        ]}
        onChange={(val) => setFilter(val as any)}
      />
      {loading ? <ActivityIndicator style={{ marginTop: spacing.md }} /> : null}
      {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}
      {!loading && filtered.length === 0 ? <Text style={{ marginTop: spacing.md }}>Sin resultados</Text> : null}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={isLarge ? 2 : 1}
        columnWrapperStyle={isLarge ? { gap: spacing.sm } : undefined}
        contentContainerStyle={{ paddingVertical: spacing.sm }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  meta: {
    color: colors.muted,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.xs,
  },
  link: {
    color: colors.primary,
    fontWeight: '600',
    marginHorizontal: spacing.xs,
  },
});

export default StationsScreen;

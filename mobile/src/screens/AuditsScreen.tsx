import React, { useEffect, useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { ActivityIndicator, Button, List, Text } from 'react-native-paper';
import { AppCard } from '@/components/AppCard';
import { colors, spacing } from '@/theme/tokens';
import { api } from '@/services/api';
import { Audit } from '@/types';

const AuditsScreen: React.FC = () => {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [selected, setSelected] = useState<Audit | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const isLarge = useWindowDimensions().width >= 900;

  useEffect(() => {
    api
      .getAudits()
      .then((data) => {
        setAudits(data);
        setSelected(data[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    const action = status === 'Approved' ? api.approveAudit : api.rejectAudit;
    const updated = await action(id);
    if (updated) {
      setAudits((prev) => prev.map((a) => (a.id === id ? updated : a)));
      setSelected(updated);
      setToast(`Auditoría ${status.toLowerCase()}`);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: spacing.lg }} />;

  return (
    <View style={[styles.container, { flexDirection: isLarge ? 'row' : 'column' }]}>
      <View style={{ flex: 1, padding: spacing.md }}>
        <Text variant="headlineMedium">Auditoría remota</Text>
        <AppCard>
          {audits.map((audit) => (
            <List.Item
              key={audit.id}
              title={audit.stationId}
              description={`Inspector ${audit.inspectorName}`}
              onPress={() => setSelected(audit)}
              right={() => <Text style={{ color: audit.status === 'Pending' ? colors.warning : audit.status === 'Approved' ? colors.success : colors.danger }}>{audit.status}</Text>}
            />
          ))}
        </AppCard>
      </View>
      <View style={{ flex: isLarge ? 1 : undefined, padding: spacing.md }}>
        {selected ? (
          <AppCard title="Detalle">
            <Text style={styles.meta}>Inspector: {selected.inspectorName}</Text>
            <Text style={styles.meta}>Checklist: {selected.checklistScore}%</Text>
            <Text style={styles.meta}>Creado: {new Date(selected.createdAt).toLocaleString()}</Text>
            <Text style={{ marginVertical: spacing.sm }}>{selected.observations}</Text>
            <View style={styles.actions}>
              <Button mode="contained" onPress={() => updateStatus(selected.id, 'Approved')}>
                Aprobar
              </Button>
              <Button mode="outlined" textColor={colors.danger} onPress={() => updateStatus(selected.id, 'Rejected')}>
                Rechazar
              </Button>
            </View>
            {toast ? <Text style={{ color: colors.muted }}>{toast}</Text> : null}
          </AppCard>
        ) : (
          <Text style={{ color: colors.muted }}>Seleccione una auditoría</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  meta: {
    color: colors.text,
    marginBottom: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});

export default AuditsScreen;

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ActivityIndicator, Button, List, Modal, Portal, Text, TextInput } from 'react-native-paper';
import { AppCard } from '@/components/AppCard';
import { SegmentedControl } from '@/components/SegmentedControl';
import { colors, spacing } from '@/theme/tokens';
import { api } from '@/services/api';
import { ReportFilters } from '@/types';
import { aggregateReportData, defaultReportData } from '@/utils/report';

const periodOptions: ReportFilters['period'][] = ['Week', 'Month', 'Quarter', 'Year'];
const typeOptions: ReportFilters['type'][] = ['Compliance', 'Price analysis', 'Complaints'];

const ReportsScreen: React.FC = () => {
  const [filters, setFilters] = useState<ReportFilters>({ period: 'Month', type: 'Compliance' });
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [exportModal, setExportModal] = useState<string | null>(null);

  useEffect(() => {
    api
      .getReportSummary(filters)
      .then(setSummary)
      .finally(() => setLoading(false));
  }, [filters]);

  const aggregated = aggregateReportData(filters, defaultReportData);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <Text variant="headlineMedium">Reportes</Text>
      <View style={{ marginVertical: spacing.sm }}>
        <SegmentedControl value={filters.period} options={periodOptions.map((p) => ({ label: p, value: p }))} onChange={(v) => setFilters((f) => ({ ...f, period: v as ReportFilters['period'] }))} />
      </View>
      <View style={{ marginBottom: spacing.sm }}>
        <SegmentedControl value={filters.type} options={typeOptions.map((p) => ({ label: p, value: p }))} onChange={(v) => setFilters((f) => ({ ...f, type: v as ReportFilters['type'] }))} />
      </View>

      <AppCard title="Filtros adicionales">
        <TextInput label="Desde" placeholder="2024-05-01" mode="outlined" style={{ marginBottom: spacing.xs }} onChangeText={(val) => setFilters((f) => ({ ...f, startDate: val }))} />
        <TextInput label="Hasta" placeholder="2024-06-30" mode="outlined" onChangeText={(val) => setFilters((f) => ({ ...f, endDate: val }))} />
      </AppCard>

      {loading ? <ActivityIndicator /> : null}
      {summary ? (
        <View style={{ gap: spacing.sm }}>
          <AppCard title="Resumen simulado">
            <Text>Total estaciones: {summary.totals.stations}</Text>
            <Text>Denuncias: {summary.totals.complaints}</Text>
            <Text>Auditorías: {summary.totals.audits}</Text>
          </AppCard>
          <AppCard title="KPIs de reporte">
            <Text>Cumplimiento promedio: {(aggregated.complianceRate * 100).toFixed(1)}%</Text>
            <Text>Precio promedio: ${aggregated.averagePrice}</Text>
            <Text>Denuncias pendientes: {aggregated.pendingComplaints}</Text>
          </AppCard>
          <AppCard title="Exportar">
            <View style={styles.exportRow}>
              <Button mode="contained" icon="file-pdf-box" onPress={() => setExportModal('PDF')}>
                Exportar PDF
              </Button>
              <Button mode="outlined" icon="microsoft-excel" onPress={() => setExportModal('Excel')}>
                Exportar Excel
              </Button>
              <Button mode="outlined" icon="file-delimited" onPress={() => setExportModal('CSV')}>
                Exportar CSV
              </Button>
            </View>
            <Text style={styles.meta}>La descarga será simulada y guardada como texto local.</Text>
          </AppCard>

          <AppCard title="Reportes recientes">
            {summary.summaries.map((item: any) => (
              <List.Item
                key={item.title}
                title={item.title}
                description={item.createdAt}
                right={() => <Button onPress={() => setExportModal(item.title)}>Descargar</Button>}
              />
            ))}
          </AppCard>
        </View>
      ) : null}

      <Portal>
        <Modal visible={!!exportModal} onDismiss={() => setExportModal(null)} contentContainerStyle={styles.modal}>
          <Text variant="titleLarge">Exportación lista</Text>
          <Text style={{ marginVertical: spacing.xs }}>"{exportModal}" generado como texto local.</Text>
          <Button onPress={() => setExportModal(null)}>Cerrar</Button>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  exportRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  meta: {
    color: colors.muted,
    marginTop: spacing.xs,
  },
  modal: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    margin: spacing.md,
    borderRadius: 12,
  },
});

export default ReportsScreen;

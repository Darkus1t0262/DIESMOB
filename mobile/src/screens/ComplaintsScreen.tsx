import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { ActivityIndicator, Button, HelperText, List, Menu, Snackbar, Text, TextInput } from 'react-native-paper';
import { AppCard } from '@/components/AppCard';
import { SegmentedControl } from '@/components/SegmentedControl';
import { colors, spacing } from '@/theme/tokens';
import { api } from '@/services/api';
import { Complaint, IssueType, Station } from '@/types';
import { complaintSchema, ComplaintForm } from '@/utils/validation';

const issueTypes: IssueType[] = ['Price mismatch', 'Quantity fraud', 'Closed station', 'Other'];

type Tab = 'new' | 'history';

const ComplaintsScreen: React.FC = () => {
  const [tab, setTab] = useState<Tab>('new');
  const [stations, setStations] = useState<Station[]>([]);
  const [stationMenu, setStationMenu] = useState(false);
  const [issueMenu, setIssueMenu] = useState(false);
  const [form, setForm] = useState<ComplaintForm>({ stationId: '', stationName: '', issueType: '', description: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.getStations(), api.getComplaints()])
      .then(([st, cmp]) => {
        setStations(st);
        setHistory(cmp);
      })
      .finally(() => setLoading(false));
  }, []);

  const setField = (key: keyof ComplaintForm, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    const parsed = complaintSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((e) => {
        if (e.path[0]) fieldErrors[e.path[0] as string] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});
    try {
      const result = await api.createComplaint(parsed.data as any);
      setHistory((prev) => [result, ...prev]);
      setToast('Denuncia registrada (simulada)');
      setForm({ stationId: '', stationName: '', issueType: '', description: '' });
    } catch (err: any) {
      setToast(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const captureGPS = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setToast('Permiso de GPS denegado');
      return;
    }
    const position = await Location.getCurrentPositionAsync({});
    setField('gps', { lat: position.coords.latitude, lng: position.coords.longitude });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.5 });
    if (!result.canceled) {
      setField('photoUri', result.assets[0].uri);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: spacing.lg }} />;
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <View style={styles.headerRow}>
          <Text variant="headlineMedium">Denuncias ciudadanas</Text>
          <SegmentedControl value={tab} options={[{ label: 'Nueva denuncia', value: 'new' }, { label: 'Historial', value: 'history' }]} onChange={(val) => setTab(val)} />
        </View>

        {tab === 'new' ? (
          <AppCard>
            <Menu visible={stationMenu} onDismiss={() => setStationMenu(false)} anchor={<TextInput
              label="Estación"
              value={form.stationName}
              onFocus={() => setStationMenu(true)}
              right={<TextInput.Icon icon="menu-down" />}
              mode="outlined"
              error={!!errors.stationId}
              style={styles.input}
            />}>
              {stations.map((st) => (
                <Menu.Item
                  onPress={() => {
                    setField('stationId', st.id);
                    setField('stationName', st.name);
                    setStationMenu(false);
                  }}
                  title={`${st.name} (${st.city})`}
                  key={st.id}
                />
              ))}
            </Menu>
            {errors.stationId ? <HelperText type="error">{errors.stationId}</HelperText> : null}

            <Menu
              visible={issueMenu}
              onDismiss={() => setIssueMenu(false)}
              anchor={<TextInput
                label="Tipo de denuncia"
                value={form.issueType}
                onFocus={() => setIssueMenu(true)}
                right={<TextInput.Icon icon="menu-down" />}
                mode="outlined"
                error={!!errors.issueType}
                style={styles.input}
              />}
            >
              {issueTypes.map((it) => (
                <Menu.Item
                  key={it}
                  onPress={() => {
                    setField('issueType', it);
                    setIssueMenu(false);
                  }}
                  title={it}
                />
              ))}
            </Menu>
            {errors.issueType ? <HelperText type="error">{errors.issueType}</HelperText> : null}

            <TextInput
              label="Descripción"
              value={form.description}
              onChangeText={(text) => setField('description', text)}
              mode="outlined"
              multiline
              numberOfLines={4}
              error={!!errors.description}
              style={styles.input}
            />
            {errors.description ? <HelperText type="error">{errors.description}</HelperText> : null}

            <View style={styles.actions}>
              <Button icon="map-marker" mode="outlined" onPress={captureGPS}>
                GPS opcional
              </Button>
              <Button icon="camera" mode="outlined" onPress={pickImage}>
                Foto opcional
              </Button>
            </View>
            {form.photoUri ? <Text style={styles.meta}>Foto seleccionada</Text> : null}
            {form.gps ? <Text style={styles.meta}>GPS: {form.gps.lat.toFixed(4)}, {form.gps.lng.toFixed(4)}</Text> : null}

            <Button mode="contained" onPress={handleSubmit} loading={submitting}>
              Enviar denuncia
            </Button>
          </AppCard>
        ) : (
          <AppCard title="Historial de denuncias">
            {history.map((cmp) => (
              <List.Item
                key={cmp.id}
                title={`${cmp.issueType} - ${cmp.stationName}`}
                description={new Date(cmp.createdAt).toLocaleString()}
                right={() => <Text style={{ color: cmp.status === 'Pending' ? colors.warning : colors.success }}>{cmp.status}</Text>}
              />
            ))}
            {history.length === 0 ? <Text>No hay denuncias</Text> : null}
          </AppCard>
        )}
      </ScrollView>
      <Snackbar visible={!!toast} onDismiss={() => setToast(null)} duration={3000}>
        {toast}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerRow: {
    gap: spacing.sm,
  },
  input: {
    marginBottom: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.sm,
  },
  meta: {
    color: colors.muted,
    marginBottom: spacing.xs,
  },
});

export default ComplaintsScreen;

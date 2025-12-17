import React, { useEffect, useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import MapView, { Circle, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { ActivityIndicator, Text, Button } from 'react-native-paper';
import * as Location from 'expo-location';
import { colors, spacing } from '@/theme/tokens';
import { api } from '@/services/api';
import { Station } from '@/types';

const ecuRegion: Region = {
  latitude: -1.8312,
  longitude: -78.1834,
  latitudeDelta: 8,
  longitudeDelta: 8,
};

const complianceColor = {
  Complies: colors.success,
  Observation: colors.warning,
  Infraction: colors.danger,
};

const MapScreen: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<Region>(ecuRegion);
  const [message, setMessage] = useState<string | null>(null);
  const isLarge = useWindowDimensions().width >= 900;

  useEffect(() => {
    api
      .getStations()
      .then(setStations)
      .finally(() => setLoading(false));
  }, []);

  const goToMyLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setMessage('Permiso de GPS denegado');
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    });
  };

  return (
    <View style={styles.container}>
      {loading ? <ActivityIndicator style={{ marginTop: spacing.lg }} /> : null}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {stations.map((station) => {
          const totalLiters = station.fuels.reduce((acc, fuel) => acc + fuel.dailyLitersSold, 0);
          const radius = 200 + (totalLiters / 25000) * 6000;
          const fillColor = complianceColor[station.complianceStatus] + '40';
          return (
            <React.Fragment key={station.id}>
              <Marker coordinate={{ latitude: station.lat, longitude: station.lng }} title={station.name} description={station.city} pinColor={complianceColor[station.complianceStatus]} />
              <Circle center={{ latitude: station.lat, longitude: station.lng }} radius={radius} fillColor={fillColor} strokeColor={fillColor} />
            </React.Fragment>
          );
        })}
      </MapView>
      <View style={[styles.overlay, { flexDirection: isLarge ? 'column' : 'row' }]}>
        <Button mode="contained" icon="crosshairs-gps" onPress={goToMyLocation}>
          GPS
        </Button>
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Leyenda</Text>
          <Text style={{ color: colors.success }}>● Cumple</Text>
          <Text style={{ color: colors.warning }}>● Observación</Text>
          <Text style={{ color: colors.danger }}>● Infracción</Text>
        </View>
      </View>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  overlay: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    gap: spacing.xs,
  },
  legend: {
    backgroundColor: colors.surface,
    padding: spacing.xs,
    borderRadius: 8,
    elevation: 2,
  },
  legendTitle: {
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  message: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.surface,
    padding: spacing.xs,
    borderRadius: 6,
  },
});

export default MapScreen;

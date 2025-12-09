import React, { useEffect, useState, createContext, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TextInput, Button, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

const Stack = createNativeStackNavigator();

const ApiContext = createContext();

const API_URL = 'http://localhost:4000/api';

function ApiProvider({ children }) {
  const [token, setToken] = useState(null);
  const client = axios.create({ baseURL: API_URL });
  client.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  return <ApiContext.Provider value={{ client, token, setToken }}>{children}</ApiContext.Provider>;
}

function useApi() {
  return useContext(ApiContext);
}

function LoginScreen({ navigation }) {
  const { client, setToken } = useApi();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('secret123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await client.post('/auth/login', { email, password });
      setToken(res.data.token);
      navigation.replace('Dashboard');
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 12 }}>DieselSubsidyManager</Text>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" style={{ borderWidth: 1, marginBottom: 8 }} />
      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, marginBottom: 8 }} />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      {loading ? <ActivityIndicator /> : <Button title="Login" onPress={handleLogin} />}
    </View>
  );
}

function DashboardScreen({ navigation }) {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Dashboard</Text>
      <Button title="Vehicles" onPress={() => navigation.navigate('Vehicles')} />
      <View style={{ height: 8 }} />
      <Button title="New Fuel Transaction" onPress={() => navigation.navigate('NewFuel')} />
      <View style={{ height: 8 }} />
      <Button title="AI Alerts" onPress={() => navigation.navigate('Alerts')} />
    </View>
  );
}

function VehicleListScreen({ navigation }) {
  const { client } = useApi();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await client.get('/vehicles');
        setVehicles(res.data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <FlatList
      data={vehicles}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('VehicleDetail', { vehicle: item })} style={{ padding: 12, borderBottomWidth: 1 }}>
          <Text style={{ fontWeight: 'bold' }}>{item.plate} - {item.model}</Text>
          {item.image_url && (
            <Image source={{ uri: item.image_url }} style={{ width: '100%', height: 120, marginTop: 8 }} />
          )}
        </TouchableOpacity>
      )}
    />
  );
}

function VehicleDetailScreen({ route }) {
  const { client } = useApi();
  const [vehicle, setVehicle] = useState(route.params.vehicle);
  const [transactions, setTransactions] = useState([]);

  const refresh = async () => {
    const res = await client.get(`/vehicles/${vehicle.id}`);
    setVehicle(res.data);
    const txRes = await client.get('/fuel-transactions');
    setTransactions(txRes.data.filter((tx) => tx.vehicle_id === vehicle.id));
  };

  useEffect(() => {
    refresh();
  }, []);

  const uploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (result.canceled) return;
    const form = new FormData();
    form.append('image', {
      uri: result.assets[0].uri,
      name: 'vehicle.jpg',
      type: 'image/jpeg',
    });
    await client.post(`/vehicles/${vehicle.id}/image`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
    await refresh();
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{vehicle.brand} {vehicle.model}</Text>
      <Text>Plate: {vehicle.plate}</Text>
      <Text>Tank capacity: {vehicle.tank_capacity} L</Text>
      {vehicle.image_url && <Image source={{ uri: vehicle.image_url }} style={{ width: '100%', height: 200, marginVertical: 8 }} />}
      <Button title="Upload image" onPress={uploadImage} />
      <Text style={{ marginTop: 12, fontWeight: 'bold' }}>Fuel transactions</Text>
      {transactions.map((tx) => (
        <View key={tx.id} style={{ borderBottomWidth: 1, paddingVertical: 6 }}>
          <Text>{new Date(tx.datetime).toLocaleString()} - {tx.liters} L</Text>
          <Text>Station: {tx.station_name} | Driver: {tx.driver_name}</Text>
        </View>
      ))}
    </View>
  );
}

function NewFuelScreen() {
  const { client } = useApi();
  const [vehicleId, setVehicleId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [stationId, setStationId] = useState('');
  const [liters, setLiters] = useState('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');

  const submit = async () => {
    try {
      await client.post('/fuel-transactions', {
        vehicleId,
        driverId,
        stationId,
        datetime: new Date().toISOString(),
        liters: Number(liters),
        pricePerLiter: Number(price),
      });
      setMessage('Fuel transaction saved');
    } catch (err) {
      setMessage('Error saving transaction');
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Vehicle ID</Text>
      <TextInput value={vehicleId} onChangeText={setVehicleId} style={{ borderWidth: 1, marginBottom: 6 }} />
      <Text>Driver ID</Text>
      <TextInput value={driverId} onChangeText={setDriverId} style={{ borderWidth: 1, marginBottom: 6 }} />
      <Text>Station ID</Text>
      <TextInput value={stationId} onChangeText={setStationId} style={{ borderWidth: 1, marginBottom: 6 }} />
      <Text>Liters</Text>
      <TextInput value={liters} onChangeText={setLiters} keyboardType="numeric" style={{ borderWidth: 1, marginBottom: 6 }} />
      <Text>Price per liter</Text>
      <TextInput value={price} onChangeText={setPrice} keyboardType="numeric" style={{ borderWidth: 1, marginBottom: 6 }} />
      <Button title="Save" onPress={submit} />
      {message ? <Text>{message}</Text> : null}
    </View>
  );
}

function AlertsScreen() {
  const { client } = useApi();
  const [vehicleId, setVehicleId] = useState('');
  const [liters, setLiters] = useState('');
  const [result, setResult] = useState(null);

  const check = async () => {
    try {
      const res = await client.post('/ai/anomaly-check', { vehicleId, liters: Number(liters) });
      setResult(res.data);
    } catch (err) {
      setResult({ message: 'Error checking anomaly' });
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: 'bold' }}>Anomaly check</Text>
      <Text>Vehicle ID</Text>
      <TextInput value={vehicleId} onChangeText={setVehicleId} style={{ borderWidth: 1, marginBottom: 6 }} />
      <Text>Liters</Text>
      <TextInput value={liters} onChangeText={setLiters} keyboardType="numeric" style={{ borderWidth: 1, marginBottom: 6 }} />
      <Button title="Check" onPress={check} />
      {result && (
        <View style={{ marginTop: 12 }}>
          <Text>Suspicious: {String(result.suspicious)}</Text>
          <Text>Risk score: {result.riskScore}</Text>
          <Text>{result.message}</Text>
        </View>
      )}
    </View>
  );
}

export default function App() {
  return (
    <ApiProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Vehicles" component={VehicleListScreen} />
          <Stack.Screen name="VehicleDetail" component={VehicleDetailScreen} options={{ title: 'Vehicle detail' }} />
          <Stack.Screen name="NewFuel" component={NewFuelScreen} options={{ title: 'New fuel transaction' }} />
          <Stack.Screen name="Alerts" component={AlertsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApiProvider>
  );
}

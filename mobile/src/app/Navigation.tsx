import React from 'react';
import { useWindowDimensions } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Appbar } from 'react-native-paper';
import { colors } from '@/theme/tokens';
import LoginScreen from '@/screens/LoginScreen';
import HomeScreen from '@/screens/HomeScreen';
import StationsScreen from '@/screens/StationsScreen';
import StationDetailScreen from '@/screens/StationDetailScreen';
import ComplaintsScreen from '@/screens/ComplaintsScreen';
import AuditsScreen from '@/screens/AuditsScreen';
import MapScreen from '@/screens/MapScreen';
import ReportsScreen from '@/screens/ReportsScreen';
import { useAuth } from './AuthContext';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const dimensions = useWindowDimensions();
  const isLarge = dimensions.width >= 900;
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: isLarge ? 'permanent' : 'front',
        drawerStyle: isLarge ? { width: 260 } : undefined,
      }}
      defaultStatus={isLarge ? 'open' : 'closed'}
    >
      <Drawer.Screen name="Inicio" component={HomeScreen} />
      <Drawer.Screen name="Estaciones" component={StationsScreen} />
      <Drawer.Screen name="Denuncias" component={ComplaintsScreen} />
      <Drawer.Screen name="Auditorías" component={AuditsScreen} />
      <Drawer.Screen name="Mapa" component={MapScreen} />
      <Drawer.Screen name="Reportes" component={ReportsScreen} />
    </Drawer.Navigator>
  );
};

const AppNavigator = () => {
  const { token, loading, logout } = useAuth();
  const navTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: colors.background },
  };

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator>
        {!token ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen
              name="App"
              component={DrawerNavigator}
              options={{
                header: ({ navigation, route, options }) => (
                  <Appbar.Header>
                    {!options?.headerShown && null}
                    {!navigation.canGoBack() ? null : <Appbar.BackAction onPress={navigation.goBack} />}
                    <Appbar.Content title="EcoCombustible Regulador" subtitle="Panel de Supervisión" />
                    <Appbar.Action icon="logout" onPress={logout} />
                  </Appbar.Header>
                ),
              }}
            />
            <Stack.Screen name="StationDetail" component={StationDetailScreen} options={{ title: 'Detalle de estación' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

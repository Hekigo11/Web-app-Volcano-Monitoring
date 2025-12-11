import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from './screens/Dashboard';
import Logs from './screens/Logs';
import Controls from './screens/Controls';
import Toast from 'react-native-toast-message';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const Tab = createBottomTabNavigator();

const palette = {
  background: '#FEF9F9',
  text: '#190406',
  accent: '#BC4A52',
  primary: '#EBA97F'
};

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: palette.background,
    card: '#FFFFFF',
    text: palette.text,
    primary: palette.accent,
    border: '#F1E5DE'
  }
};

const TabLabel = ({ label, focused }) => (
  <View style={styles.tabLabelWrapper}>
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
  </View>
);

export default function App() {
  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style="dark" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: '#F1E5DE', height: 64, paddingBottom: 10, paddingTop: 8 },
          tabBarActiveTintColor: palette.accent,
          tabBarInactiveTintColor: '#8B7A73'
        }}
      >
        <Tab.Screen name="Dashboard" component={Dashboard} options={{ tabBarLabel: ({ focused }) => <TabLabel label="Dashboard" focused={focused} /> }} />
        <Tab.Screen name="Logs" component={Logs} options={{ tabBarLabel: ({ focused }) => <TabLabel label="Live Logs" focused={focused} /> }} />
        <Tab.Screen name="Controls" component={Controls} options={{ tabBarLabel: ({ focused }) => <TabLabel label="Controls" focused={focused} /> }} />
      </Tab.Navigator>
      <Toast position="top" topOffset={50} />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabLabelWrapper: {
    alignItems: 'center'
  },
  tabLabel: {
    fontSize: 12,
    color: '#8B7A73',
    fontWeight: '700'
  },
  tabLabelActive: {
    color: palette.accent
  }
});

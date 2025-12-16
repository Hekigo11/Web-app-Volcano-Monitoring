import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Dashboard from './screens/Dashboard';
import Logs from './screens/Logs';
import Controls from './screens/Controls';
import Toast from 'react-native-toast-message';
import { StyleSheet } from 'react-native';
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

export default function App() {
  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style="dark" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: '#F1E5DE', height: 64, paddingBottom: 10, paddingTop: 8 },
          tabBarActiveTintColor: palette.accent,
          tabBarInactiveTintColor: '#8B7A73',
          tabBarLabelStyle: { fontSize: 12, fontWeight: '700' }
        }}
      >
        <Tab.Screen 
          name="Dashboard" 
          component={Dashboard} 
          options={{ 
            tabBarLabel: 'Dashboard',
            tabBarIcon: ({ color, size }) => <Ionicons name="speedometer" size={size} color={color} />
          }} 
        />
        <Tab.Screen 
          name="Logs" 
          component={Logs} 
          options={{ 
            tabBarLabel: 'Live Logs',
            tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />
          }} 
        />
        <Tab.Screen 
          name="Controls" 
          component={Controls} 
          options={{ 
            tabBarLabel: 'Controls',
            tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />
          }} 
        />
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

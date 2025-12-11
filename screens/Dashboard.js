import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { onValue } from 'firebase/database';
import { latestReadingQuery } from '../firebase';
import SensorCard from '../components/SensorCard';
import AlertBadge from '../components/AlertBadge';
import { StatusBar } from 'expo-status-bar';

const palette = {
  background: '#FEF9F9',
  text: '#190406',
  accent: '#BC4A52',
  primary: '#EBA97F',
  secondary: '#E5A25F',
  card: '#FFFFFF'
};

const Dashboard = () => {
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onValue(latestReadingQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const key = Object.keys(data)[0];
        setReading({ id: key, ...data[key] });
      }
      setLoading(false);
    }, () => setLoading(false));

    return () => unsubscribe();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator color={palette.accent} size="large" style={{ marginTop: 32 }} />;
    }

    if (!reading) {
      return <Text style={styles.muted}>No data yet.</Text>;
    }

    const alertLevel = reading.alert_level || 'green';
    const lastUpdated = reading.timestamp ? new Date(reading.timestamp).toLocaleString() : '—';

    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Current Status</Text>
          <AlertBadge level={alertLevel} />
        </View>

        <View style={[styles.indicator, { backgroundColor: pickAlertColor(alertLevel) }]}>
          <Text style={styles.indicatorText}>{alertLevel.toUpperCase()}</Text>
        </View>

        <SensorCard label="Temperature" value={reading?.dht?.temp_c ?? '—'} unit="°C" />
        <SensorCard label="Humidity" value={reading?.dht?.hum_pct ?? '—'} unit="%" />
        <SensorCard label="PM2.5" value={reading?.pm?.pm2_5 ?? '—'} />
        <SensorCard label="PM10" value={reading?.pm?.pm10 ?? '—'} />
        <SensorCard label="MQ135 Gas" value={reading?.mq_voltage ?? '—'} unit="V" />
        <SensorCard label="Tremor Magnitude" value={reading?.accel_mag_g ?? '—'} unit="g" />

        <View style={styles.reasonBox}>
          <Text style={styles.reasonLabel}>Reason</Text>
          <Text style={styles.reason}>{reading?.reason || '—'}</Text>
        </View>

        <Text style={styles.timestamp}>Last updated: {lastUpdated}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <StatusBar style="dark" />
      {renderContent()}
    </ScrollView>
  );
};

const pickAlertColor = (level) => {
  switch (level) {
    case 'red':
      return '#BC4A52';
    case 'orange':
      return '#E58E2B';
    case 'yellow':
      return '#E5A25F';
    default:
      return '#70C175';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background
  },
  card: {
    backgroundColor: palette.card,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1E5DE'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.text
  },
  indicator: {
    height: 80,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  indicatorText: {
    color: '#FEF9F9',
    fontWeight: '800',
    letterSpacing: 1
  },
  reasonBox: {
    backgroundColor: '#F7EBE4',
    borderRadius: 14,
    padding: 12,
    marginTop: 4,
    marginBottom: 12
  },
  reasonLabel: {
    fontSize: 14,
    color: '#6A5245',
    marginBottom: 4
  },
  reason: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600'
  },
  timestamp: {
    marginTop: 8,
    color: '#6A5245',
    fontSize: 13
  },
  muted: {
    marginTop: 24,
    color: '#6A5245',
    fontSize: 16,
    textAlign: 'center'
  }
});

export default Dashboard;

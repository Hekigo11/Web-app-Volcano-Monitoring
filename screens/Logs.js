import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { onValue, query, orderByKey } from 'firebase/database';
import { readingsRef } from '../firebase';
import AlertBadge from '../components/AlertBadge';
import { StatusBar } from 'expo-status-bar';

const palette = {
  background: '#FEF9F9',
  text: '#190406',
  card: '#FFFFFF'
};

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const logsQuery = query(readingsRef, orderByKey());
    const unsubscribe = onValue(logsQuery, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, value]) => ({ id, ...value }));
      list. sort((a, b) => {
  const timeA = a.timestamp ?  new Date(a. timestamp).getTime() : 0;
  const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
  return timeB - timeA;
});
      // list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      setLogs(list);
      setLoading(false);
    }, () => setLoading(false));

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => {
    const time = item.timestamp ? new Date(item.timestamp).toLocaleString() : '—';
    return (
      <View style={styles.rowCard}>
        <View style={styles.rowHeader}>
          <Text style={styles.time}>{time}</Text>
          <AlertBadge level={item.alert_level} />
        </View>
        <Text style={styles.summary}>
          Temp: {item?.dht?.temp_c ?? '—'}°C | PM2.5: {item?.pm?.pm2_5 ?? '—'} | Gas: {item?.mq_voltage ?? '—'}V | Tremor: {item?.accel_mag_g ?? '—'} g
        </Text>
        <Text style={styles.reason}>{item.reason || '—'}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {loading ? (
        <ActivityIndicator color="#BC4A52" size="large" style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          ListEmptyComponent={<Text style={styles.empty}>No logs yet.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background
  },
  rowCard: {
    backgroundColor: palette.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1E5DE'
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  time: {
    color: '#6A5245',
    fontSize: 13
  },
  summary: {
    color: palette.text,
    fontSize: 15,
    marginBottom: 4,
    fontWeight: '600'
  },
  reason: {
    color: '#6A5245',
    fontSize: 14
  },
  empty: {
    marginTop: 24,
    textAlign: 'center',
    color: '#6A5245',
    fontSize: 16
  }
});

export default Logs;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const palette = {
  background: '#FEF9F9',
  text: '#190406',
  card: '#FFFFFF',
  shadow: '#E5A25F'
};

const SensorCard = ({ label, value, unit }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>
        {value}
        {unit ? ` ${unit}` : ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F4E6DC'
  },
  label: {
    color: '#6A5245',
    fontSize: 14,
    marginBottom: 4
  },
  value: {
    color: palette.text,
    fontSize: 22,
    fontWeight: '700'
  }
});

export default SensorCard;

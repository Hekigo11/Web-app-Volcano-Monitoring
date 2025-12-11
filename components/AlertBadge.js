import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const palette = {
  text: '#190406'
};

const alertColors = {
  green: '#70C175',
  yellow: '#E5A25F',
  orange: '#E58E2B',
  red: '#BC4A52'
};

const AlertBadge = ({ level }) => {
  const safeLevel = typeof level === 'string' ? level : 'green';
  const color = alertColors[safeLevel] || alertColors.green;
  return (
    <View style={[styles.badge, { backgroundColor: color }]}> 
      <Text style={styles.text}>{safeLevel.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start'
  },
  text: {
    color: palette.text,
    fontWeight: '700',
    letterSpacing: 0.4
  }
});

export default AlertBadge;

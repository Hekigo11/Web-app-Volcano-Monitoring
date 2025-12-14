import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const palette = {
  text: '#190406',
  textLight: '#FEF9F9'
};

// Map numeric levels to colors and labels (matching Python code)
const levelConfig = {
  0: { color: '#70C175', label: 'NORMAL' },
  1: { color: '#E5A25F', label: 'LOW' },
  2: { color: '#E58E2B', label: 'MODERATE' },
  3: { color: '#BC4A52', label: 'HIGH' },
  4: { color: '#8B0000', label: 'HAZARDOUS' },
  5: { color: '#4A0000', label: 'CRITICAL' }
};

const AlertBadge = ({ level }) => {
  // Handle both numeric and string levels
  let numLevel = 0;
  if (typeof level === 'number') {
    numLevel = level;
  } else if (typeof level === 'string') {
    const parsed = parseInt(level, 10);
    if (!isNaN(parsed)) {
      numLevel = parsed;
    }
  }
  
  // Clamp to valid range
  numLevel = Math.max(0, Math.min(5, numLevel));
  
  const config = levelConfig[numLevel] || levelConfig[0];
  const useLight = numLevel >= 2;
  
  return (
    <View style={[styles.badge, { backgroundColor: config.color }]}> 
      <Text style={[styles.text, useLight && styles.textLight]}>{config.label}</Text>
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
    letterSpacing: 0.4,
    fontSize: 12
  },
  textLight: {
    color: palette.textLight
  }
});

export default AlertBadge;

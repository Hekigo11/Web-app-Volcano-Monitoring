import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { onValue, update } from 'firebase/database';
import Toast from 'react-native-toast-message';
import { commandsRef } from '../firebase';
import { StatusBar } from 'expo-status-bar';

const palette = {
  background: '#FEF9F9',
  text: '#190406',
  accent: '#BC4A52',
  primary: '#EBA97F',
  secondary: '#E5A25F',
  card: '#FFFFFF'
};

const Controls = () => {
  const [state, setState] = useState({
    pm_threshold: '',
    tremor_threshold: '',
    gas_threshold: '',
    manual_mode: false,
    beacon: 0,
    siren: 0,
    led_color: 'green',
    emergency_flag: 0
  });

  useEffect(() => {
    const unsubscribe = onValue(commandsRef, (snapshot) => {
      const data = snapshot.val() || {};
      setState((prev) => ({ ...prev, ...data }));
    });
    return () => unsubscribe();
  }, []);

  const pushUpdate = async (payload) => {
    try {
      await update(commandsRef, payload);
      Toast.show({ type: 'success', text1: 'Updated', text2: 'Command sent to Firebase' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Update failed', text2: error.message });
    }
  };

  const handleNumberChange = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveNumbers = () => {
    const payload = {
      pm_threshold: Number(state.pm_threshold),
      tremor_threshold: Number(state.tremor_threshold),
      gas_threshold: Number(state.gas_threshold)
    };
    pushUpdate(payload);
  };

  const toggleManual = () => {
    const value = !state.manual_mode;
    setState((prev) => ({ ...prev, manual_mode: value }));
    pushUpdate({ manual_mode: value });
  };

  const setBinary = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
    pushUpdate({ [key]: value });
  };

  const setColor = (color) => {
    setState((prev) => ({ ...prev, led_color: color }));
    pushUpdate({ led_color: color });
  };

  const triggerEmergency = () => {
    setState((prev) => ({ ...prev, emergency_flag: 1 }));
    pushUpdate({ emergency_flag: 1 });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <StatusBar style="dark" />
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.title}>Manual Mode</Text>
          <Switch
            value={!!state.manual_mode}
            onValueChange={toggleManual}
            thumbColor={state.manual_mode ? palette.accent : '#f4f3f4'}
            trackColor={{ false: '#d7d2d0', true: '#F0C6B1' }}
          />
        </View>

        <Text style={styles.sectionLabel}>Thresholds</Text>
        <View style={styles.inputRow}>
          <Field label="PM" value={String(state.pm_threshold ?? '')} onChangeText={(t) => handleNumberChange('pm_threshold', t)} />
          <Field label="Tremor" value={String(state.tremor_threshold ?? '')} onChangeText={(t) => handleNumberChange('tremor_threshold', t)} />
          <Field label="Gas" value={String(state.gas_threshold ?? '')} onChangeText={(t) => handleNumberChange('gas_threshold', t)} />
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveNumbers}>
          <Text style={styles.saveText}>Save Thresholds</Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>Actuators</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Beacon</Text>
          <View style={styles.buttonRow}>
            <SmallButton label="ON" active={state.beacon === 1} onPress={() => setBinary('beacon', 1)} />
            <SmallButton label="OFF" active={state.beacon === 0} onPress={() => setBinary('beacon', 0)} />
          </View>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Siren</Text>
          <View style={styles.buttonRow}>
            <SmallButton label="ON" active={state.siren === 1} onPress={() => setBinary('siren', 1)} />
            <SmallButton label="OFF" active={state.siren === 0} onPress={() => setBinary('siren', 0)} />
          </View>
        </View>

        <Text style={styles.sectionLabel}>LED Color</Text>
        <View style={styles.colorRow}>
          {['green', 'yellow', 'red'].map((c) => (
            <TouchableOpacity key={c} style={[styles.colorBox, styles[c], state.led_color === c && styles.selected]} onPress={() => setColor(c)} />
          ))}
        </View>

        <Text style={styles.sectionLabel}>Emergency</Text>
        <TouchableOpacity style={styles.emergency} onPress={triggerEmergency}>
          <Text style={styles.emergencyText}>Trigger Emergency Override</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const Field = ({ label, value, onChangeText }) => (
  <View style={styles.field}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder="0"
      keyboardType="numeric"
      placeholderTextColor="#B4A69B"
    />
  </View>
);

const SmallButton = ({ label, active, onPress }) => (
  <TouchableOpacity style={[styles.smallButton, active && styles.smallButtonActive]} onPress={onPress}>
    <Text style={[styles.smallButtonText, active && styles.smallButtonTextActive]}>{label}</Text>
  </TouchableOpacity>
);

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
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text
  },
  sectionLabel: {
    marginTop: 12,
    marginBottom: 8,
    color: '#6A5245',
    fontWeight: '700'
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10
  },
  field: {
    flex: 1
  },
  fieldLabel: {
    color: '#6A5245',
    marginBottom: 4
  },
  input: {
    backgroundColor: '#F7EBE4',
    borderRadius: 12,
    padding: 12,
    color: palette.text,
    borderWidth: 1,
    borderColor: '#E9D5C7'
  },
  saveButton: {
    backgroundColor: palette.accent,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center'
  },
  saveText: {
    color: '#FEF9F9',
    fontWeight: '700'
  },
  label: {
    color: palette.text,
    fontWeight: '700'
  },
  buttonRow: {
    flexDirection: 'row'
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E1D0C6',
    marginLeft: 8
  },
  smallButtonActive: {
    backgroundColor: '#F0C6B1',
    borderColor: palette.accent
  },
  smallButtonText: {
    color: palette.text,
    fontWeight: '700'
  },
  smallButtonTextActive: {
    color: palette.text
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12
  },
  colorBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E1D0C6'
  },
  selected: {
    borderColor: palette.accent,
    borderWidth: 3
  },
  green: { backgroundColor: '#70C175' },
  yellow: { backgroundColor: '#E5A25F' },
  red: { backgroundColor: '#BC4A52' },
  emergency: {
    backgroundColor: '#BC4A52',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 8
  },
  emergencyText: {
    color: '#FEF9F9',
    fontWeight: '800'
  }
});

export default Controls;

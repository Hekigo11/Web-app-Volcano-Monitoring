import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
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
  card: '#FFFFFF',
  disabled: '#D0C8C4'
};

// Default thresholds (matching Python code)
const DEFAULTS = {
  pm_threshold: 150,
  tremor_threshold: 0.15,
  gas_threshold: 3.0
};

const Controls = () => {
  const [state, setState] = useState({
    pm_threshold: DEFAULTS.pm_threshold,
    tremor_threshold: DEFAULTS.tremor_threshold,
    gas_threshold: DEFAULTS.gas_threshold,
    manual_mode: false,
    beacon: 0,
    siren: 0,
    led_color: 'green',
    emergency_flag: 0
  });

  useEffect(() => {
    const unsubscribe = onValue(commandsRef, (snapshot) => {
      const data = snapshot.val() || {};
      setState((prev) => ({ 
        ...prev, 
        pm_threshold: data.pm_threshold ?? DEFAULTS.pm_threshold,
        tremor_threshold: data.tremor_threshold ?? DEFAULTS.tremor_threshold,
        gas_threshold: data.gas_threshold ?? DEFAULTS.gas_threshold,
        manual_mode: data.manual_mode ?? false,
        beacon: data.beacon ?? 0,
        siren: data.siren ?? 0,
        led_color: data.led_color ?? 'green',
        emergency_flag: data.emergency_flag ?? 0
      }));
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

  const handleSliderChange = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSliderComplete = (key, value) => {
    pushUpdate({ [key]: value });
  };

  const resetToDefault = (key) => {
    const value = DEFAULTS[key];
    setState((prev) => ({ ...prev, [key]: value }));
    pushUpdate({ [key]: value });
  };

  const toggleManual = () => {
    const value = !state.manual_mode;
    if (!value) {
      // Turning OFF manual mode - reset all actuators to safe state
      const resetPayload = {
        manual_mode: false,
        beacon: 0,
        siren: 0,
        led_color: 'green',
        emergency_flag: 0
      };
      setState((prev) => ({ ...prev, ...resetPayload }));
      pushUpdate(resetPayload);
    } else {
      setState((prev) => ({ ...prev, manual_mode: true }));
      pushUpdate({ manual_mode: true });
    }
  };

  const setBinary = (key, value) => {
    if (!state.manual_mode) return; // Only allow when manual mode is ON
    setState((prev) => ({ ...prev, [key]: value }));
    pushUpdate({ [key]: value });
  };

  const setColor = (color) => {
    if (!state.manual_mode) return; // Only allow when manual mode is ON
    setState((prev) => ({ ...prev, led_color: color }));
    pushUpdate({ led_color: color });
  };

  const triggerEmergency = () => {
    if (!state.manual_mode) return; // Only allow when manual mode is ON
    setState((prev) => ({ ...prev, emergency_flag: 1 }));
    pushUpdate({ emergency_flag: 1 });
  };

  const isManual = !!state.manual_mode;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <StatusBar style="dark" />
      <View style={styles.card}>
        {/* THRESHOLDS SECTION */}
        <Text style={styles.sectionLabel}>Thresholds</Text>
        
        {/* PM Threshold */}
        <View style={[styles.sliderRow, isManual && styles.disabledRow]}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>PM2.5 Threshold</Text>
            <TouchableOpacity 
              style={[styles.resetButton, isManual && styles.disabledButton]} 
              onPress={() => resetToDefault('pm_threshold')}
              disabled={isManual}
            >
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={50}
            maximumValue={500}
            step={10}
            value={state.pm_threshold}
            onValueChange={(v) => handleSliderChange('pm_threshold', v)}
            onSlidingComplete={(v) => handleSliderComplete('pm_threshold', v)}
            minimumTrackTintColor={isManual ? palette.disabled : palette.accent}
            maximumTrackTintColor="#E1D0C6"
            thumbTintColor={isManual ? palette.disabled : palette.accent}
            disabled={isManual}
          />
          <Text style={styles.sliderValue}>{Math.round(state.pm_threshold)} µg/m³</Text>
        </View>

        {/* Tremor Threshold */}
        <View style={[styles.sliderRow, isManual && styles.disabledRow]}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>Tremor Threshold</Text>
            <TouchableOpacity 
              style={[styles.resetButton, isManual && styles.disabledButton]} 
              onPress={() => resetToDefault('tremor_threshold')}
              disabled={isManual}
            >
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0.05}
            maximumValue={1.0}
            step={0.01}
            value={state.tremor_threshold}
            onValueChange={(v) => handleSliderChange('tremor_threshold', v)}
            onSlidingComplete={(v) => handleSliderComplete('tremor_threshold', v)}
            minimumTrackTintColor={isManual ? palette.disabled : palette.accent}
            maximumTrackTintColor="#E1D0C6"
            thumbTintColor={isManual ? palette.disabled : palette.accent}
            disabled={isManual}
          />
          <Text style={styles.sliderValue}>{state.tremor_threshold.toFixed(2)} g</Text>
        </View>

        {/* Gas Threshold */}
        <View style={[styles.sliderRow, isManual && styles.disabledRow]}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>Gas Threshold</Text>
            <TouchableOpacity 
              style={[styles.resetButton, isManual && styles.disabledButton]} 
              onPress={() => resetToDefault('gas_threshold')}
              disabled={isManual}
            >
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={1.0}
            maximumValue={5.0}
            step={0.1}
            value={state.gas_threshold}
            onValueChange={(v) => handleSliderChange('gas_threshold', v)}
            onSlidingComplete={(v) => handleSliderComplete('gas_threshold', v)}
            minimumTrackTintColor={isManual ? palette.disabled : palette.accent}
            maximumTrackTintColor="#E1D0C6"
            thumbTintColor={isManual ? palette.disabled : palette.accent}
            disabled={isManual}
          />
          <Text style={styles.sliderValue}>{state.gas_threshold.toFixed(1)} V</Text>
        </View>

        {/* MANUAL MODE SWITCH */}
        <View style={styles.manualModeContainer}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.title}>Manual Mode</Text>
              <Text style={styles.manualHint}>
                {isManual ? 'Actuators enabled, thresholds locked' : 'Auto mode active'}
              </Text>
            </View>
            <Switch
              value={isManual}
              onValueChange={toggleManual}
              thumbColor={isManual ? palette.accent : '#f4f3f4'}
              trackColor={{ false: '#d7d2d0', true: '#F0C6B1' }}
            />
          </View>
        </View>

        {/* ACTUATORS SECTION */}
        <Text style={[styles.sectionLabel, !isManual && styles.disabledText]}>Actuators</Text>
        
        <View style={[styles.rowBetween, !isManual && styles.disabledRow]}>
          <Text style={[styles.label, !isManual && styles.disabledText]}>Beacon</Text>
          <View style={styles.buttonRow}>
            <SmallButton 
              label="ON" 
              active={state.beacon === 1} 
              onPress={() => setBinary('beacon', 1)} 
              disabled={!isManual}
            />
            <SmallButton 
              label="OFF" 
              active={state.beacon === 0} 
              onPress={() => setBinary('beacon', 0)} 
              disabled={!isManual}
            />
          </View>
        </View>
        
        <View style={[styles.rowBetween, !isManual && styles.disabledRow]}>
          <Text style={[styles.label, !isManual && styles.disabledText]}>Siren</Text>
          <View style={styles.buttonRow}>
            <SmallButton 
              label="ON" 
              active={state.siren === 1} 
              onPress={() => setBinary('siren', 1)} 
              disabled={!isManual}
            />
            <SmallButton 
              label="OFF" 
              active={state.siren === 0} 
              onPress={() => setBinary('siren', 0)} 
              disabled={!isManual}
            />
          </View>
        </View>

        <Text style={[styles.sectionLabel, !isManual && styles.disabledText]}>LED Color</Text>
        <View style={[styles.colorRow, !isManual && styles.disabledRow]}>
          {['green', 'yellow', 'red'].map((c) => (
            <TouchableOpacity 
              key={c} 
              style={[
                styles.colorBox, 
                styles[c], 
                state.led_color === c && styles.selected,
                !isManual && styles.colorBoxDisabled
              ]} 
              onPress={() => setColor(c)}
              disabled={!isManual}
            />
          ))}
        </View>

        <Text style={[styles.sectionLabel, !isManual && styles.disabledText]}>Emergency</Text>
        <TouchableOpacity 
          style={[styles.emergency, !isManual && styles.emergencyDisabled]} 
          onPress={triggerEmergency}
          disabled={!isManual}
        >
          <Text style={styles.emergencyText}>Trigger Emergency Override</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const SmallButton = ({ label, active, onPress, disabled }) => (
  <TouchableOpacity 
    style={[
      styles.smallButton, 
      active && !disabled && styles.smallButtonActive,
      disabled && styles.smallButtonDisabled
    ]} 
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={[
      styles.smallButtonText, 
      active && !disabled && styles.smallButtonTextActive,
      disabled && styles.disabledText
    ]}>{label}</Text>
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
    marginTop: 16,
    marginBottom: 8,
    color: '#6A5245',
    fontWeight: '700',
    fontSize: 14
  },
  // Slider styles
  sliderRow: {
    backgroundColor: '#F7EBE4',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  sliderLabel: {
    color: palette.text,
    fontWeight: '600',
    fontSize: 14
  },
  slider: {
    width: '100%',
    height: 40
  },
  sliderValue: {
    color: palette.accent,
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center'
  },
  resetButton: {
    backgroundColor: palette.secondary,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8
  },
  resetText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600'
  },
  // Manual mode
  manualModeContainer: {
    backgroundColor: '#F0E6E0',
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: palette.secondary
  },
  manualHint: {
    color: '#6A5245',
    fontSize: 12,
    marginTop: 2
  },
  // Disabled states
  disabledRow: {
    opacity: 0.5
  },
  disabledText: {
    color: palette.disabled
  },
  disabledButton: {
    backgroundColor: palette.disabled
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
  smallButtonDisabled: {
    backgroundColor: '#F5F0ED',
    borderColor: '#E1D0C6'
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
  colorBoxDisabled: {
    opacity: 0.4
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
  emergencyDisabled: {
    backgroundColor: palette.disabled
  },
  emergencyText: {
    color: '#FEF9F9',
    fontWeight: '800'
  }
});

export default Controls;

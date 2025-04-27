import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import SettingsScreen from '../../components/SettingsScreen';

export default function SettingsTab() {
  return (
    <SafeAreaView style={styles.container}>
      <SettingsScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
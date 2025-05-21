import React from 'react';
import { View, StyleSheet } from 'react-native';
import EnergyChart from '../../components/EnergyChart';

export default function ExploreScreen() {
  return (
    <View style={styles.page}>
      <View >
        <EnergyChart  />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#ECFDF5',         // light mint
    alignItems: 'center',               // center horizontally
    justifyContent: 'center',           // center vertically
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 1200,
    backgroundColor: '#ffffff',         // white card
    borderRadius: 16,
    padding: 24,
    // subtle shadow (works on web + iOS/Android)
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});
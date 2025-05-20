import React from 'react';
import { View } from 'react-native';
import EnergyChart from '../../components/EnergyChart';

export default function ExploreScreen() {
  return (
    <View style={{ flex: 1 }}>
      <EnergyChart />
    </View>
  );
}

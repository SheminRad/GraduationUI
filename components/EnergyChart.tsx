import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, Pressable, ActivityIndicator, Animated } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const FILTERS = ['hour', 'day', 'week', 'month'] as const;
type Filter = typeof FILTERS[number];

type ChartData = {
  labels: string[];
  consumption: number[];
  generation: number[];
};

type DataByFilter = {
  [key in Filter]: ChartData;
};

const processData = (rawData: string): DataByFilter => {
  const lines = rawData.trim().split('\n');
  const headers = lines[0].split(',');
  const timeIndex = headers.indexOf('timestamp');
  const consumptionIndex = headers.indexOf('consumption');
  const generationIndex = headers.indexOf('generation');

  const hourlyData: ChartData = { labels: [], consumption: [], generation: [] };
  const dailyData: ChartData = { labels: [], consumption: [], generation: [] };
  const weeklyData: ChartData = { labels: [], consumption: [], generation: [] };
  const monthlyData: ChartData = { labels: [], consumption: [], generation: [] };

  // Process each line
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const timestamp = new Date(values[timeIndex]);
    const consumption = parseFloat(values[consumptionIndex]);
    const generation = parseFloat(values[generationIndex]);

    // Hourly data (last 24 hours)
    if (i > lines.length - 24) {
      hourlyData.labels.push(timestamp.getHours() + ':00');
      hourlyData.consumption.push(consumption);
      hourlyData.generation.push(generation);
    }

    // Daily data (last 7 days)
    if (i > lines.length - 7) {
      const day = timestamp.toLocaleDateString('en-US', { weekday: 'short' });
      dailyData.labels.push(day);
      dailyData.consumption.push(consumption);
      dailyData.generation.push(generation);
    }

    // Weekly data (last 4 weeks)
    if (i > lines.length - 28) {
      const week = `W${Math.ceil(timestamp.getDate() / 7)}`;
      if (!weeklyData.labels.includes(week)) {
        weeklyData.labels.push(week);
        weeklyData.consumption.push(consumption);
        weeklyData.generation.push(generation);
      }
    }

    // Monthly data (last 6 months)
    const month = timestamp.toLocaleDateString('en-US', { month: 'short' });
    if (!monthlyData.labels.includes(month)) {
      monthlyData.labels.push(month);
      monthlyData.consumption.push(consumption);
      monthlyData.generation.push(generation);
    }
  }

  return {
    hour: hourlyData,
    day: dailyData,
    week: weeklyData,
    month: monthlyData,
  };
};

export default function EnergyChart() {  const [selected, setSelected] = useState<Filter>('hour');
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [chartData, setChartData] = useState<DataByFilter | null>(null);  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch the data file
        const response = await fetch('/energy_data.txt');
        const text = await response.text();
        
        // Process the data
        const processed = processData(text);
        setChartData(processed);
        
        // Animate the chart
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const data = chartData?.[selected] || { labels: [], consumption: [], generation: [] };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Energy Overview</Text>
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <MaterialCommunityIcons name="lightning-bolt" size={20} color="#10B981" />
          <Text style={styles.legendText}>Consumption</Text>
        </View>
        <View style={styles.legendItem}>
          <MaterialCommunityIcons name="solar-power" size={20} color="#3B82F6" />
          <Text style={styles.legendText}>Generation</Text>
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#ECFDF5', '#D1FAE5']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {renderHeader()}
      
      <View style={styles.chartContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#10B981" style={styles.loader} />
        ) : (
          <Animated.View style={{ opacity: fadeAnim }}>
            <LineChart
              data={{
                labels: data.labels,
                datasets: [
                  {
                    data: data.consumption,
                    color: () => '#10B981',
                    strokeWidth: 2,
                  },
                  {
                    data: data.generation,
                    color: () => '#3B82F6',
                    strokeWidth: 2,
                  },
                ],
              }}
              width={screenWidth - 32}
              height={220}
              chartConfig={{
                backgroundColor: 'transparent',
                backgroundGradientFrom: 'transparent',
                backgroundGradientTo: 'transparent',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: () => '#374151',
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#fff',
                },
                propsForLabels: {
                  fontSize: 12,
                },
                style: {
                  borderRadius: 16,
                },
              }}
              bezier
              style={styles.chart}
            />
          </Animated.View>
        )}
      </View>

      <View style={styles.buttonContainer}>
  {FILTERS.map((filter) => (
    <Pressable
      key={filter}
      style={({ pressed }) => [
        styles.button,
        pressed ? styles.buttonPressed : undefined,            // optional “pressed” feedback
        selected === filter && styles.activeButton, // highlight the active one
      ]}
      onPress={() => setSelected(filter)}            // <<<<< here’s the fix
    >
      <Text
        style={[
          styles.buttonText,
          selected === filter && styles.activeText,
        ]}
      >
        {filter.toUpperCase()}
      </Text>
    </Pressable>
  ))}
</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
   button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.1)',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  activeButton: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  activeText: {
    color: '#fff',
  },
  sendButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  sendButtonPressed: {
    opacity: 0.7,   // or transform: [{ scale: 0.97 }]
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600'
  },
  container: {
    borderRadius: 20,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendText: {
    fontSize: 14,
    color: '#374151',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 220,
    marginVertical: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  loader: {
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.1)',
  },
  activeButton: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
  activeText: {
    color: '#fff',
  },
});
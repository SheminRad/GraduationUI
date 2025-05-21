// HomeScreen.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Headline */}
      <Text style={styles.title}>Sunergy Here!</Text>

      {/* Robot Logo */}
      <Image
        source={require('../../assets/images/ROBOT_LOGO.png')}
        style={styles.robot}
      />

      {/* Descriptive Text */}
      <Text style={styles.subtitle}>Real-time energy monitoring.</Text>
      <Text style={styles.subtitle}>Personalized recommendations for efficiency.</Text>
      <Text style={styles.subtitle}>User-friendly insights powered by AI.</Text>
      <Text style={[styles.subtitle, { marginBottom: 20 }]}>
        Let’s power your home smarter, greener, and more efficiently!
      </Text>

      {/* Get Started with gradient, shadow & press-scale */}
      <Link href="/chat" asChild>
        <Pressable
          style={({ pressed }) => [
            styles.buttonWrapper,
            pressed && { transform: [{ scale: 0.97 }] },
          ]}
        >
          <LinearGradient
            colors={['#4ADE80', '#10B981']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </LinearGradient>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1FAE5', // light mint green
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#065F46',
  },
  robot: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#065F46',
    textAlign: 'center',
  },

  // wrap pressable so we can add shadow + press-scale
  buttonWrapper: {
    marginTop: 24,
    borderRadius: 30,
    // drop shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    // drop shadow (Android)
    elevation: 4,
  },
  buttonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

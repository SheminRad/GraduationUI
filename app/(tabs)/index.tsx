import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Link, router } from 'expo-router';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';

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

      {/* "Get Started" Button -> Navigates to Chat Screen */}
      <Link href="/chat" asChild>
        <Pressable 
          style={({ pressed }) => [
            styles.button, 
            pressed && styles.buttonPressed
          ]}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1FAE5', // A light mint green
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttonPressed: {
    opacity: 0.7,
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
  button: {
    marginTop: 16,
    backgroundColor: '#10B981',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

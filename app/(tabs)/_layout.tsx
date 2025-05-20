// File: app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1f2937',
          borderTopWidth: 0,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          marginBottom: 6,
        },
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'home') {
            return <Ionicons name="home" size={size} color={color} />;
          } else if (route.name === 'explore') {
            return <Ionicons name="analytics-sharp" size={size} color={color} />;
          } else if (route.name === 'index') {
            return <Ionicons name="chatbubbles" size={size} color={color} />;
          }
        },
        tabBarLabel:
          route.name === 'index'
            ? 'Chat'
            : route.name === 'explore'
            ? 'Graphs'
            : route.name === 'chat'
            ? 'Chat'
            : route.name,
      })}
    />
  );
}

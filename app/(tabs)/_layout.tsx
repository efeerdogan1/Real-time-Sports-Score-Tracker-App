import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { Mic, ListMusic, Settings } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1A659E',
        tabBarLabelStyle: {
          fontFamily: 'Inter-SemiBold'
        },
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 70,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTitleStyle: {
          fontFamily: 'Inter-Bold',
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Score Tracker',
          tabBarIcon: ({ color, size }) => <Mic size={size} color={color} />,
          headerTitleAlign: 'center'
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => <ListMusic size={size} color={color} />,
          headerTitleAlign: 'center'
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          headerTitleAlign: 'center'
        }}
      />
    </Tabs>
  );
}
import { Tabs } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
} from 'react-native';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { DefaultFont } from '@/constants/Fonts';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="myprogress"
        options={{
          title: 'My Progress',
          tabBarLabelStyle: styles.tabBarText,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'trophy' : 'trophy-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="snaps"
        options={{
          title: 'Snaps',
          tabBarLabelStyle: styles.tabBarText,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'images' : 'images-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarLabelStyle: styles.tabBarText,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'compass' : 'compass-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarLabelStyle: styles.tabBarText,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'map' : 'map-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'Settings',
          href: null,
          tabBarLabelStyle: styles.tabBarText,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarText: {
    fontFamily: DefaultFont.fontFamily,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

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
                tabBarShowLabel: false,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Progress',
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
                name="explore"
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
                    href: null,
                    tabBarLabelStyle: styles.tabBarText,
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'map' : 'map-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="more"
                options={{
                    title: 'More',
                    tabBarLabelStyle: styles.tabBarText,
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={
                            focused ? 'ellipsis-horizontal' : 'ellipsis-horizontal-outline'
                        } color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBarText: {
        fontFamily: DefaultFont.fontFamilyBold,
        fontSize: 11,
    },
});

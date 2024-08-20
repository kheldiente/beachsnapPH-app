import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import {
    StyleSheet,
} from 'react-native';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { DefaultFont } from '@/constants/Fonts';
import MyProgressLayout from '.';
import SnapsLayout from './snaps';
import ExploreLayout from './explore';
import MapLayout from './map';
import MoreLayout from './more';
import EmptyLayout from './empty';
import { snapsLayoutKeys } from '@/constants/Global';

const Tab = createBottomTabNavigator();

export default function TabLayout() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: Colors.light.tint,
                headerShown: false,
                tabBarShowLabel: false,
            }}>
            <Tab.Screen
                name="index"
                component={MyProgressLayout}
                options={{
                    title: 'Progress',
                    tabBarLabelStyle: styles.tabBarText,
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'trophy' : 'trophy-outline'} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="snaps"
                component={SnapsLayout}
                options={{
                    title: 'Snaps',
                    tabBarLabelStyle: styles.tabBarText,
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'images' : 'images-outline'} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="editor"
                component={EmptyLayout} // Only a placeholder!!!
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        // console.log('New Beach Snap Editor')
                        navigation.navigate(`${snapsLayoutKeys.NEW_BEACH_SNAP}`)
                    }
                })}
                options={{
                    tabBarLabelStyle: styles.tabBarText,
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'add-circle' : 'add-circle-outline'} color={'black'} size={28} />
                    ),
                }}
            />
            <Tab.Screen
                name="explore"
                component={ExploreLayout}
                options={{
                    title: 'Explore',
                    tabBarLabelStyle: styles.tabBarText,
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'compass' : 'compass-outline'} color={color} />
                    ),
                }}
            />
            {/* <Tab.Screen
                name="map"
                component={MapLayout}
                options={{
                    title: 'Map',
                    tabBarLabelStyle: styles.tabBarText,
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'map' : 'map-outline'} color={color} />
                    ),
                }}
            /> */}
            <Tab.Screen
                name="more"
                component={MoreLayout}
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
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBarText: {
        fontFamily: DefaultFont.fontFamilyBold,
        fontSize: 11,
    },
});

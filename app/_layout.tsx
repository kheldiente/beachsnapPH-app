import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AppFonts } from '@/constants/Fonts';
import TabLayout from './(tabs)/_layout';
import NewBeachSnapLayout from './beach/addbeach-page';
import { snapsLayoutKeys } from '@/constants/Global';
import { NavigationContainer } from '@react-navigation/native';
import ProfileLayout from './beach/[profile]';
import { defaultHeaderWithBackBar } from '@/constants/SharedComponent';
import PhotoPostLayout from '@/app/post';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as ReadOnlyDatabase from './db/ReadOnlyDatabase';
import * as UserDatabase from './db/UserDatabase';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator()

export default function RootLayout() {
    const [loaded] = useFonts(AppFonts);

    const waitToProceed = () => {
        setTimeout(() => {
            SplashScreen.hideAsync();
        }, 500);
    }

    const setupDbs = () => {
        ReadOnlyDatabase.initDb();
        UserDatabase.initDb();
    }

    useEffect(() => {
        if (loaded) {
            setupDbs();
            waitToProceed();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <GestureHandlerRootView>
            <NavigationContainer
                independent={true}
            >
                <Stack.Navigator>
                    <Stack.Screen
                        name='(tabs)'
                        component={TabLayout}
                        options={{
                            headerShown: false,
                            navigationBarColor: 'white',
                        }}
                    />
                    <Stack.Screen
                        name={`${snapsLayoutKeys.NEW_BEACH_SNAP}`}
                        component={NewBeachSnapLayout}
                        options={{
                            headerShown: false,
                            headerStyle: {
                                backgroundColor: 'white'
                            },
                            presentation: 'fullScreenModal',
                        }}
                    />
                    <Stack.Screen
                        name={`${snapsLayoutKeys.BEACH_PROFILE}`}
                        component={ProfileLayout}
                        options={defaultHeaderWithBackBar()}
                    />
                    <Stack.Screen
                        name={`${snapsLayoutKeys.PHOTO_POST}`}
                        component={PhotoPostLayout}
                        options={{
                            headerShown: false,
                            presentation: 'transparentModal'
                        }}
                    />

                </Stack.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}
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

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator()

export default function RootLayout() {
    const [loaded] = useFonts(AppFonts);

    const waitToProceed = () => {
        setTimeout(() => {
            SplashScreen.hideAsync();
        }, 1000);
    }

    useEffect(() => {
        if (loaded) {
            waitToProceed();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
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
            </Stack.Navigator>
        </NavigationContainer>
    );
}

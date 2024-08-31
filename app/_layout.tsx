import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AppFonts } from '@/constants/Fonts';
import TabLayout from './(tabs)/_layout';
import NewBeachSnapLayout from './beach/addbeach-page';
import { dbName, dbVersions, snapsLayoutKeys } from '@/constants/Global';
import { NavigationContainer } from '@react-navigation/native';
import ProfileLayout from './beach/[profile]';
import { defaultHeaderWithBackBar } from '@/constants/SharedComponent';
import PhotoPostLayout from '@/app/post';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SQLiteProvider } from 'expo-sqlite';
import { initDb } from './db/DatabaseHandler';

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

    const getDbAsset = () => {
        return dbVersions[0].fileUrl;
    }

    useEffect(() => {
        if (loaded) {
            initDb();
            waitToProceed();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <SQLiteProvider
            databaseName={dbName}
            assetSource={{ assetId: getDbAsset() }}
        >
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
        </SQLiteProvider>
    );
}
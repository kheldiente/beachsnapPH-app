import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import 'react-native-reanimated';
import { AppFonts } from '@/constants/Fonts';
import TabLayout from './(tabs)/_layout';
import NewBeachSnapLayout from './beach/addbeach-page';
import { homeLayoutKeys, myProgressLayoutKeys, snapsLayoutKeys } from '@/constants/Global';
import { NavigationContainer } from '@react-navigation/native';
import ProfileLayout from './beach/[profile]';
import { defaultHeaderBar, defaultHeaderWithBackBar } from '@/constants/SharedComponent';
import PhotoPostLayout from '@/app/post';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as DatabaseActions from '@/app/db/DatabaseActions';
import OnboardingLayout from '@/app/onboarding';
import SelectBeachGoalListLayout from './progress/select-beach-goal';
import * as LocalStorage from '@/app/storage/LocalStorage';
import { View } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator()

export default function RootLayout() {
    const [fontLoaded] = useFonts(AppFonts);
    const isOnboardingCompleted = useRef(false);

    const [isLoading, setIsLoading] = useState(true);

    const waitToProceed = () => {
        setTimeout(() => {
            SplashScreen.hideAsync();
        }, 500);
    }

    const setupDbAndStorage = async () => {
        setIsLoading(true);

        isOnboardingCompleted.current = await LocalStorage.isOnboardingCompleted();
        if (!isOnboardingCompleted.current) {
            await DatabaseActions.setupAllDbs();
        }

        setIsLoading(false);
        waitToProceed();
    }

    useEffect(() => {
        if (fontLoaded) {
            setupDbAndStorage();
        }
    }, [fontLoaded]);

    if (!fontLoaded) {
        return <View />;
    }

    return (isLoading ? <View />
        : <GestureHandlerRootView>
            <NavigationContainer
                independent={true}
            >
                <Stack.Navigator>
                    {!isOnboardingCompleted.current &&
                        <Stack.Screen
                            name={`${homeLayoutKeys.ONBOARDING}`}
                            component={OnboardingLayout}
                            options={{
                                headerShown: false,
                                animation: 'fade',
                            }}
                        />
                    }
                    <Stack.Screen
                        name={`${homeLayoutKeys.HOME}`}
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
                        name={`${myProgressLayoutKeys.GOAL_LIST}`}
                        component={SelectBeachGoalListLayout}
                        options={defaultHeaderBar('')}
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
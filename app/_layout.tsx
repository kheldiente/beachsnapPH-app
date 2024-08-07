import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import TabHeaderBar from '@/components/TabHeaderBar';
import DefaultTheme from "@/constants/Themes";
import { AppFonts } from '@/constants/Fonts';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const tabHeaderOptions = ({ navigation }) => {
    return {
      headerStyle: {
        // backgroundColor: "rgb(249, 249, 249)",
        backgroundColor: 'white',
        elevation: 0,
        shadowOpacity: 0
      },
      headerShadowVisible: false,
      headerTitle: (props) => (
        <TabHeaderBar
          id="tabHeaderBar"
          title={'BeachSnap PH 🏖️'}
          {...props}
        />
      )
    }
  }

  const colorScheme = useColorScheme();
  const [loaded] = useFonts(AppFonts);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={tabHeaderOptions}
        />
      </Stack>
    </ThemeProvider>
  );
}

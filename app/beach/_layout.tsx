import { useLocalSearchParams, useNavigation } from "expo-router";
import { Stack } from 'expo-router';
import { useEffect } from "react";
import { defaultHeaderWithBackBar } from "@/constants/SharedComponent";

export default function HomeLayout() {
    const { name = "Province" } = useLocalSearchParams();
    const headerTitle = `${name} 🏖️`

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    return (
        <Stack
            screenOptions={{
                animation: 'none',
            }}
        >
            <Stack.Screen
                name="[profile]"
                options={defaultHeaderWithBackBar(headerTitle)}
            />
        </Stack>
    );
}
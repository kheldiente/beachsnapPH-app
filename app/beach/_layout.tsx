import { useLocalSearchParams, useNavigation } from "expo-router";
import {
    StyleSheet
} from 'react-native';
import {
    Button,
    Text,
} from "react-native-elements";
import { Stack } from 'expo-router';
import TabHeaderBar from "@/components/TabHeaderBar";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function HomeLayout() {
    const {
        id, name = "Province"
    } = useLocalSearchParams();

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
                    title={`${name} 🏖️`}
                    {...props}
                />
            ),
            headerLeft: () => (
                <Ionicons
                    name="chevron-back-outline"
                    size={25}
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                />
            ),
        }
    }

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    return (
        <>
            <Stack
                screenOptions={{
                    animation: 'none',
                }}
            >
                <Stack.Screen
                    name="[profile]"
                    options={tabHeaderOptions}
                />
            </Stack>
        </>
    );
}

const styles = StyleSheet.create({
    backBtn: {
        backgroundColor: 'transparent',
        color: 'black'
    }
})
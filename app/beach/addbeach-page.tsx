import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { DefaultFont } from '@/constants/Fonts';
import { SafeAreaView } from 'react-native-safe-area-context';
import BeachSnapEditor from '@/app/editor/index';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

export default function NewBeachSnapLayout(props: any) {
    const navigation = useNavigation();

    const handleOnBackClick = () => {
        console.log("go back");
        navigation.goBack();
    }

    return (
        <SafeAreaView
            style={styles.container}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <View
                    style={{
                        position: 'absolute',
                        width: '100%',
                        alignItems: 'center',
                    }}
                >
                    <Text style={styles.title}>New beach snap</Text>
                </View>
                <TouchableOpacity
                    style={styles.close}
                    onPress={handleOnBackClick}
                >
                    <Ionicons name="chevron-back" color="black" size={22} />
                </TouchableOpacity>
            </View>
            <BeachSnapEditor
                style={{
                    marginVertical: 20,
                }}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    title: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 20,
        fontWeight: 'bold',
        color: 'green',
    },
    close: {
        paddingHorizontal: 20,
    }
});


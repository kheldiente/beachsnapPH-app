import { DefaultFont } from '@/constants/Fonts';
import { Divider } from '@rneui/themed';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';

const items = [
    {
        id: '_addBeach',
        title: 'Request a new beach',
        action: 'link',
    },
    {
        id: '_reqFeature',
        title: 'Request a feature',
        action: 'link',
        url: 'https://forms.gle/uJmkZjEiBVDZk5pB7',
    },
    {
        id: '_bugReport',
        title: 'Bug report',
        action: 'link',
    }
]

export default function SettingsLayout() {
    const renderSettingsItem = (item) => {

        const handleOnItemClick = () => {
            try {
                if (item.action === 'link' && item.url !== undefined) {
                    Linking.openURL(item.url)
                }
            } catch (e) {
                console.log(e)
            }
        }

        return (
            <View
                style={{
                    flexDirection: 'column',
                    backgroundColor: 'white',
                }}
            >
                <Divider />
                <TouchableOpacity
                    key={`settings+item_${item.id}`}
                    onPress={handleOnItemClick}
                >
                    <Text
                        style={{
                            ...styles.text,
                            fontSize: 16,
                            paddingHorizontal: 15,
                            paddingVertical: 10,
                        }}
                    >{item.title}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const renderFooter = () => {
        return (
            <View
                style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingVertical: 20,
                }}
            >
                {/* <Text
                    style={{
                        ...styles.text,
                        fontSize: 10,
                        textAlign: 'center',
                        color: 'gray'
                    }}
                >Made by mik3</Text> */}
                <Text
                    style={{
                        ...styles.text,
                        fontSize: 12,
                        textAlign: 'center',
                        color: 'gray'
                    }}
                >{`© Copyright BeachSnap PH 2024.\r\nAll rights reserved.`}</Text>
            </View>
        )
    }

    return (
        <SafeAreaView
            style={{
                ...styles.container,
                paddingVertical: 20,
            }}
            edges={['right', 'left']}
        >
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                }}
            >
                {items.map((item) => renderSettingsItem(item))}
                <Divider />
                {renderFooter()}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    text: {
        fontFamily: DefaultFont.fontFamily
    }
});

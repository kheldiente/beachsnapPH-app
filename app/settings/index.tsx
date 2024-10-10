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
import { Ionicons } from '@expo/vector-icons';

const items = [
    {
        id: '_addBeach',
        title: 'Request a new beach',
        action: 'link',
        url: 'https://forms.gle/FVf2Tckruf3euQ4z6',
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
        url: 'https://forms.gle/YxqRu2Shf7aa5FJG9',
    },
]

const socialMediaItems = [
    {
        id: '_social_facebook',
        title: 'Facebook',
        action: 'link',
        url: 'https://www.facebook.com/beachsnap.ph',
        iconName: 'logo-facebook'
    },
    {
        id: '_social_instagram',
        title: 'Instagram',
        action: 'link',
        url: 'https://www.instagram.com/beachsnap.ph',
        iconName: 'logo-instagram'
    }
]

export default function SettingsLayout() {

    const renderSettingsItems = (items) => {

        const handleOnItemClick = (item) => {
            try {
                if (item.action === 'link' && item.url !== undefined) {
                    Linking.openURL(item.url)
                }
            } catch (e) {
                console.log(e)
            }
        }

        const renderItem = (item) => {
            return (
                <View
                    key={`settings+item_${item.id}`}
                    style={{
                        flexDirection: 'column',
                        backgroundColor: 'white',
                    }}
                >
                    <Divider />
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                        }}
                        onPress={() => handleOnItemClick(item)}
                    >
                        <Text
                            style={{
                                ...styles.text,
                                paddingLeft: 15,
                                paddingVertical: 10,
                            }}
                        >{item.title}</Text>
                        {item.iconName &&
                            <View
                                style={{
                                    justifyContent: 'center',
                                    marginLeft: 5,
                                }}
                            >
                                <Ionicons
                                    name={item.iconName}
                                    size={22}
                                    color='gray'
                                />
                            </View>
                        }
                    </TouchableOpacity>
                </View>
            )
        }
        return (
            <View>
                <Text style={styles.textBold}>Support</Text>
                {items.map((_item) => renderItem(_item))}
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

    const renderSocialMediaItems = (items) => {

        const handleOnItemClick = (item) => {
            try {
                if (item.action === 'link' && item.url !== undefined) {
                    Linking.openURL(item.url)
                }
            } catch (e) {
                console.log(e)
            }
        }

        const renderItem = (item) => {
            return (
                <View
                    key={`settings+item_${item.id}`}
                    style={{
                        flexDirection: 'column',
                        backgroundColor: 'white',
                    }}
                >
                    <Divider />
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                        }}
                        onPress={() => handleOnItemClick(item)}
                    >
                        <Text
                            style={{
                                ...styles.text,
                                paddingLeft: 15,
                                paddingVertical: 10,
                            }}
                        >{item.title}</Text>
                        {item.iconName &&
                            <View
                                style={{
                                    justifyContent: 'center',
                                    marginLeft: 5,
                                }}
                            >
                                <Ionicons
                                    name={item.iconName}
                                    size={22}
                                    color='gray'
                                />
                            </View>
                        }
                    </TouchableOpacity>
                </View>
            )
        }
        return (
            <View>
                <Text style={styles.textBold}>Follow us</Text>
                {items.map((_item) => renderItem(_item))}
            </View>
        )
    }

    return (
        <SafeAreaView
            style={{
                ...styles.container,
            }}
            edges={['right', 'left']}
        >
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                }}
            >
                {renderSettingsItems(items)}
                <Divider />
                {renderSocialMediaItems(socialMediaItems)}
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
        fontFamily: DefaultFont.fontFamily,
        fontSize: 14,
    },
    textBold: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 16,
        marginLeft: 15,
        marginVertical: 8,
    }
});

import { DefaultFont } from '@/constants/Fonts';
import { Ionicons } from '@expo/vector-icons';
import { Button, CheckBox } from '@rneui/themed';
import { useNavigation } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';
import {
    StyleSheet,
    View,
} from 'react-native';
import { Divider } from 'react-native-elements';
import { SafeAreaView } from "react-native-safe-area-context";
import * as LocalStorage from '@/app/storage/LocalStorage';

export default function AppInterceptLayout({ navigation, route }) {
    const { displayOnly } = route.params ?? { displayOnly: false };
    const [showAgainCheckBoxState, setShowAgainCheckBoxState] = useState(false);

    var ctaText = displayOnly ? 'Close' : 'I understand'

    const renderBackground = () => {
        return (
            <View
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }}
            />
        )
    }

    const renderAppText = (text) => {
        return <Text style={styles.text}>{text}</Text>
    }

    const renderHeaderText = (text) => {
        return <Text style={styles.textHeader}>{text}</Text>
    }

    const renderDivider = () => {
        return <Divider style={{ marginVertical: 10 }} />
    }

    const renderDataPrivacyMessage = () => {
        return (
            <View
                style={{
                    height: '100%',
                    justifyContent: 'center',
                }}
            >
                <View
                    style={{
                        backgroundColor: 'white',
                        paddingHorizontal: 15,
                        paddingVertical: 15,
                        marginHorizontal: 15,
                        borderRadius: 5,
                    }}
                >
                    {renderHeaderText('Important Information About Your Data')}
                    {renderAppText('\nIn BeachSnap PH, all of your entries, photos, and other data are stored directly on your device. This means that:\n')}
                    {renderAppText('1. Your photos and their information are safely kept on your phone and are not uploaded to the cloud.')}
                    {renderAppText('2. Your data is private and remains in your control at all times.')}
                    {renderAppText('\nPlease note: If you uninstall the app, all of your stored data, including your photos and their information, will be permanently lost, as it is only stored locally on your device.\n')}
                    {renderAppText('To avoid losing your data, we recommend regularly backing up your information manually to an external source or exporting any important files before uninstalling the app.')}
                    {renderAppText('\nThank you for using BeachSnap PH!')}

                    {renderBottomView()}
                </View>
            </View>
        )
    }

    const renderBottomView = () => {

        const handleDoNotShowInterceptCheckboxClick = async () => {
            // False = do not show again the intercept
            await LocalStorage.setShowInformationIntercept(showAgainCheckBoxState)
            
            setShowAgainCheckBoxState(!showAgainCheckBoxState)
        }

        const handleCtaClick = () => {
            navigation.goBack();
        }

        return (
            <View
                style={{ marginTop: 18 }}
            >
                {!displayOnly &&
                    <View
                        style={{
                            alignContent: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                        }}
                    >
                        <CheckBox
                            containerStyle={{
                                paddingVertical: 2,
                            }}
                            titleProps={{
                                style: {
                                    fontFamily: DefaultFont.fontFamily,
                                    fontSize: 13,
                                    marginLeft: 6,
                                }
                            }}
                            title={"Don't show this to me again"}
                            key={'_chckbx+dontShow'}
                            checkedIcon={
                                <Ionicons
                                    name="checkbox"
                                    color="darkviolet"
                                    size={20}
                                />
                            }
                            uncheckedIcon={
                                <Ionicons
                                    name="checkbox-outline"
                                    color="gray"
                                    size={20}
                                />
                            }
                            checked={showAgainCheckBoxState}
                            onPress={handleDoNotShowInterceptCheckboxClick}
                        />
                    </View>
                }
                <Button
                    key={'_intercept+Cta'}
                    titleStyle={styles.buttonTitle}
                    buttonStyle={styles.button}
                    title={ctaText}
                    onPress={handleCtaClick}
                />
            </View>
        )
    }

    return (
        <SafeAreaView
            style={styles.container} edges={['right', 'left']}
        >
            {renderBackground()}
            {renderDataPrivacyMessage()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
    },
    text: {
        fontFamily: DefaultFont.fontFamily,
        color: 'black',
        fontSize: 13
    },
    textHeader: {
        fontFamily: DefaultFont.fontFamilyBold,
        color: 'black',
        fontSize: 16
    },
    buttonTitle: {
        fontFamily: DefaultFont.fontFamilyBold,
        fontSize: 16,
    },
    button: {
        color: 'white',
        backgroundColor: 'green',
        width: '100%',
        borderRadius: 10,
    },
});
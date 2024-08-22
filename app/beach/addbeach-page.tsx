import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
    Platform,
} from 'react-native';
import { DefaultFont } from '@/constants/Fonts';
import { SafeAreaView } from 'react-native-safe-area-context';
import BeachSnapEditor from '@/app/editor/index';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { addKeyboardListener } from '@/constants/Utils';

const pageKey = '_bchSnapEdtr';

export default function NewBeachSnapLayout(props: any) {
    const navigation = useNavigation();
    const showScreen = useRef(pageKey);
    const [isKeyboardShown, setIsKeyboardShown] = useState(false);
    const [dimBackground, setDimBackground] = useState(false);
    const [saveCtaEnabled, setSaveCtaEnabled] = useState(false);

    const handleOnBackClick = () => {
        navigation.goBack();
    }

    const handleOnSaveClick = () => {
        navigation.goBack();
    }

    const hideKeyboard = () => {
        Keyboard.dismiss();
    }

    const doOnShowKeyboard = () => {
        setIsKeyboardShown(true);
    }

    const doOnHideKeyboard = () => {
        setIsKeyboardShown(false);
    }

    const setDimBackgroundAndResetKey = (yes) => {
        if (!yes) {
            showScreen.current = pageKey;
        }
        setDimBackground(yes);
    }

    const handleOnSelectItem = (key) => {
        console.log(`selectedItem: ${key}`);
        showScreen.current = key;

        if (key === '_chevronList+_dateVstd') {
            if (Platform.OS === 'ios') {
                setDimBackgroundAndResetKey(true);
            }
        } else if (key === '_chevronList+_bchName') {
            setDimBackgroundAndResetKey(true);
        }
    }

    const handleOnSelectDate = () => {
        if (Platform.OS === 'ios') {
            setDimBackgroundAndResetKey(false);
        }
    }

    const handleOnChangeBeachName = () => {
        setDimBackgroundAndResetKey(false);
    }

    const handleOnUpdatedBeachData = (data) => {
        console.log(`beachData: ${JSON.stringify(data)}`);

        const { image, beachName, dateVisited } = data;
        const isValidData = image
            && beachName
            && dateVisited

        setSaveCtaEnabled(isValidData);
    }

    useEffect(() => {
        addKeyboardListener(
            () => {
                if (showScreen.current !== pageKey) {
                    return;
                }
                doOnShowKeyboard()
            },
            () => {
                if (showScreen.current !== pageKey) {
                    return;
                }
                doOnHideKeyboard()
            }
        )
    }, []);

    return (
        <SafeAreaView
            style={styles.container}
        >
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                }}
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
                        <Text style={styles.title}>
                            {!isKeyboardShown
                                ? `New beach snap`
                                : `Caption`
                            }
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignContent: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <TouchableOpacity
                            onPress={handleOnBackClick}
                        >
                            <Ionicons
                                style={styles.close}
                                name="chevron-back"
                                color="black" size={22}
                            />
                        </TouchableOpacity>
                        {isKeyboardShown &&
                            <TouchableOpacity onPress={hideKeyboard}>
                                <Text style={styles.ok}>OK</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
                <BeachSnapEditor
                    style={{
                        marginVertical: 20,
                    }}
                    onSelectItem={handleOnSelectItem}
                    onSelectDate={handleOnSelectDate}
                    onChangeBeachName={handleOnChangeBeachName}
                    onUpdatedBeachData={handleOnUpdatedBeachData}
                />
                {!isKeyboardShown &&
                    <View>
                        <TouchableOpacity
                            style={
                                saveCtaEnabled
                                    ? styles.save
                                    : styles.saveDisabled
                            }
                            disabled={!saveCtaEnabled}
                            onPress={handleOnSaveClick}
                        >
                            <Text
                                style={styles.saveCta}
                            >Save</Text>
                        </TouchableOpacity>
                    </View>
                }
                {dimBackground &&
                    <View
                        style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)'
                        }}
                    />
                }
            </View>
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
        fontFamily: DefaultFont.fontFamilyBold,
        fontSize: 20,
        color: 'green',
    },
    close: {
        paddingHorizontal: 20,
    },
    ok: {
        fontFamily: DefaultFont.fontFamilyBold,
        fontSize: 16,
        paddingHorizontal: 20,
    },
    save: {
        backgroundColor: 'green',
        paddingVertical: 10,
        marginHorizontal: 20,
        marginBottom: 10,
        borderRadius: 10,
    },
    saveDisabled: {
        backgroundColor: 'lightgray',
        paddingVertical: 10,
        marginHorizontal: 20,
        marginBottom: 10,
        borderRadius: 10,
    },
    saveCta: {
        fontFamily: DefaultFont.fontFamilyBold,
        fontSize: 20,
        alignSelf: 'center',
        color: 'white',
    }
});


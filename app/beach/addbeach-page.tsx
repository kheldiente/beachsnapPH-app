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
import { useEffect, useState } from 'react';
import { addKeyboardListener } from '@/constants/Utils';

export default function NewBeachSnapLayout(props: any) {
    const navigation = useNavigation();
    const [isKeyboardShown, setIsKeyboardShown] = useState(false);
    const [dimBackground, setDimBackground] = useState(false);

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

    const handleOnSelectItem = (key) => {
        if (key === '_chevronList+_dateVstd') {
            if (Platform.OS === 'ios') {
                setDimBackground(true);
            }
        }
    }

    const handleOnSelectDate = () => {
        if (Platform.OS === 'ios') {
            setDimBackground(false);
        }
    } 

    useEffect(() => {
        addKeyboardListener(
            () => { doOnShowKeyboard() },
            () => { doOnHideKeyboard() }
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
                />
                {!isKeyboardShown &&
                    <View>
                        <TouchableOpacity
                            style={styles.save}
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
        fontFamily: DefaultFont.fontFamily,
        fontSize: 20,
        fontWeight: 'bold',
        color: 'green',
    },
    close: {
        paddingHorizontal: 20,
    },
    ok: {
        fontFamily: DefaultFont.fontFamily,
        fontWeight: 'bold',
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
    saveCta: {
        fontFamily: DefaultFont.fontFamily,
        fontWeight: 'bold',
        fontSize: 20,
        alignSelf: 'center',
        color: 'white',
    }
});


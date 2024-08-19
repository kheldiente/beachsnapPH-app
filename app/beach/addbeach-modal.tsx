import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Keyboard,
    Platform,
} from 'react-native';
import FullScreenModal from '@/components/FullScreenModal';
import BeachSnapEditor from '@/app/editor/index';
import { useEffect, useRef, useState } from 'react';
import { DefaultFont } from '@/constants/Fonts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { addKeyboardListener } from '@/constants/Utils';

const pageKey = '_bchSnapEdtr';

export default function NewBeachSnapModal({ isVisible, onClose, onSave }) {
    const insets = useSafeAreaInsets();
    const showScreen = useRef(pageKey);
    const [isKeyboardShown, setIsKeyboardShown] = useState(false);
    const [dimBackground, setDimBackground] = useState(false);

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

    const setDimBackgroundAndResetKey = (yes) => {
        if (!yes) {
            showScreen.current = pageKey;
        }
        setDimBackground(yes);
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
        <FullScreenModal
            title='New beach snap'
            keyboardTitle='Caption'
            isKeyboardShown={isKeyboardShown}
            isVisible={isVisible}
            onClose={onClose}
            onHideKeyboard={hideKeyboard}
        >
            <BeachSnapEditor
                onSelectItem={handleOnSelectItem}
                onSelectDate={handleOnSelectDate}
                onChangeBeachName={handleOnChangeBeachName}
            />
            {!isKeyboardShown &&
                <View>
                    <TouchableOpacity
                        style={{
                            ...styles.save,
                            marginBottom: insets.bottom + 10,
                        }}
                        onPress={onSave}
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
        </FullScreenModal>
    )
}

const styles = StyleSheet.create({
    save: {
        backgroundColor: 'green',
        paddingVertical: 10,
        marginHorizontal: 20,
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

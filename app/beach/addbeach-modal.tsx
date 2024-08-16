import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Keyboard,
} from 'react-native';
import FullScreenModal from '@/components/FullScreenModal';
import BeachSnapEditor from '@/app/editor/index';
import { useEffect, useState } from 'react';
import { DefaultFont } from '@/constants/Fonts';
import { useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NewBeachSnapModal({ isVisible, onClose, onSave }) {
    const insets = useSafeAreaInsets();
    const [isKeyboardShown, setIsKeyboardShown] = useState(false);

    const hideKeyboard = () => {
        Keyboard.dismiss();
    }

    const doOnShowKeyboard = () => {
        setIsKeyboardShown(true);
    }

    const doOnHideKeyboard = () => {
        setIsKeyboardShown(false);
    }

    useEffect(() => {
        Keyboard.addListener('keyboardWillShow', () => {
            doOnShowKeyboard();
        });

        Keyboard.addListener('keyboardWillHide', () => {
            doOnHideKeyboard();
        });
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
            <BeachSnapEditor />
            {!isKeyboardShown &&
                <View>
                    <TouchableOpacity
                        style={{
                            backgroundColor: 'green',
                            paddingVertical: 10,
                            marginHorizontal: 10,
                            marginBottom: insets.bottom,
                            borderRadius: 10,
                        }}
                        onPress={onSave}
                    >
                        <Text
                            style={{
                                fontFamily: DefaultFont.fontFamily,
                                fontWeight: 'bold',
                                fontSize: 20,
                                alignSelf: 'center',
                                color: 'white',
                            }}
                        >Save</Text>
                    </TouchableOpacity>
                </View>
            }
        </FullScreenModal>
    )
}

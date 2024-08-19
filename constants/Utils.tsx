import { Keyboard, Platform } from "react-native";

export const addKeyboardListener = (
    onShowKeyboard: () => void,
    onHideKeyboard: () => void
) => {
    if (Platform.OS === 'android') {
        Keyboard.addListener('keyboardDidShow', () => {
            onShowKeyboard();
        });

        Keyboard.addListener('keyboardDidHide', () => {
            onHideKeyboard();
        });
    } else if (Platform.OS === 'ios') {
        Keyboard.addListener('keyboardWillShow', () => {
            onShowKeyboard();
        });

        Keyboard.addListener('keyboardWillHide', () => {
            onHideKeyboard();
        });
    }
}

export const dateToMDY = (date: Date) => {
    return date.toDateString()
        .split(' ')
        .slice(1)
        .join(' ');
}
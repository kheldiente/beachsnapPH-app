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
}

export const dateStringToMDY = (dateString: string) => {
    const [datePart, timePart] = dateString.split(', ');
    const [month, day, year] = datePart.split('/');
    const [time, period] = timePart.split(' ');
    const [hours, minutes, seconds] = time.split(':');

    const date = new Date(
        parseInt(year),
        parseInt(month) - 1, // Month is 0-indexed
        parseInt(day),
        period === 'PM' ? parseInt(hours) + 12 : parseInt(hours),
        parseInt(minutes),
        parseInt(seconds)
    );
    return date.toDateString();
}
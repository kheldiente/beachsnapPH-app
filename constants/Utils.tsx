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
    const origDate = new Date(dateString).toLocaleString();
    const [datePart, timePart] = origDate.split(', ');
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

export const dateStringToTime = (dateString: string) => {
    const origDate = new Date(dateString).toLocaleString();
    const [datePart, timePart] = origDate.split(', ');
    const [month, day, year] = datePart.split('/');
    const [hours, minutes, seconds] = timePart.split(':');
    const period = timePart.includes('PM') ? 'PM' : 'AM';
    return `${hours}:${minutes} ${period}`;
}

export const createWeatherLabel = (item) => {
    const isANoun = ["thunderstorm", "earthquake"];
    var weatherDesc = `it was ${item.weather.name.toLowerCase()}`;

    if (isANoun.includes(item.weather.name.toLowerCase())) {
        const isFirstLetterConsonant = ["a", "e", "i", "o", "u"]
            .includes(item.weather.name.charAt(0).toLowerCase());

        var article = 'a';
        if (isFirstLetterConsonant) {
            article = 'an';
        }
        weatherDesc = `there was ${article} ${item.weather.name.toLowerCase()}`;
    }
    return `At ${dateStringToTime(item.dateVisited)}, ${weatherDesc}`;
}
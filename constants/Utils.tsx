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
    const [week, month, day, year] = date.toDateString().split(' ');
    return `${week} ${month}, ${day} ${year}`;
}

export const dateStringToMDY = (dateString: string, noWeekday: boolean = false) => {
    const origDate = new Date(dateString).toDateString();
    const [week, month, day, year] = origDate.split(' ');
    return noWeekday ? `${month}, ${day} ${year}` : `${week} ${month}, ${day} ${year}`;
}

export const dateStringToTime = (dateString: string) => {
    const origDate = new Date(dateString).toLocaleString();
    const [_, timePart] = origDate.split(', ');
    const [hours, minutes, _seconds] = timePart.split(':');
    const period = timePart.includes('PM') ? 'PM' : 'AM';
    return `${hours}:${minutes} ${period}`;
}

export const dateToUnixTimestamp = (date: Date) => {
    return Math.round(date.getTime() / 1000);
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

export function getOrdinal(n: number): string {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }
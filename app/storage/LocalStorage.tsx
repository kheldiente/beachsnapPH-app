import AsyncStorage from '@react-native-async-storage/async-storage';

const onBoardingKey = 'onboardingCompleted';
const readOnlyDbNameKey = 'readOnlyDbNameKey'

export const setItem = async (key: string, value: string) => {
    await AsyncStorage.setItem(key, value);
}

export const getItem = async (key: string) => {
    return await AsyncStorage.getItem(key);
}

export const setOnboardingCompleted = async () => {
    await setItem(onBoardingKey, 'true');
}

export const isOnboardingCompleted = async () => {
    const item = await getItem(onBoardingKey);
    return item !== null ? `${item}` === 'true' : false;
}

export const isToReimportReadOnlyDb = async (newDbName) => {
    const currentDbName = await getItem(readOnlyDbNameKey)
    return currentDbName === null || currentDbName !== newDbName
}

export const setNewReadOnlyDbName = async (newDbName) => {
    await setItem(readOnlyDbNameKey, newDbName);
}
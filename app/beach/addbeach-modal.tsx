import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Keyboard,
    Platform,
} from 'react-native';
import FullScreenModal from '@/components/FullScreenModal';
import BeachSnapEditor, { generateParams } from '@/app/editor/index';
import { useEffect, useRef, useState } from 'react';
import { DefaultFont } from '@/constants/Fonts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { addKeyboardListener } from '@/constants/Utils';
import * as DatabaseActions from '@/app/db/DatabaseActions';
import { strings } from '@/constants/Global';

const pageKey = '_bchSnapEdtr';

export default function NewBeachSnapModal({
    isVisible,
    onClose,
    onSave,
    onSkip,
    showSkipButton = false,
    preselectedBeach = null,
}) {
    const insets = useSafeAreaInsets();
    const showScreen = useRef(pageKey);
    const currSnapData = useRef(null);
    const [isKeyboardShown, setIsKeyboardShown] = useState(false);
    const [dimBackground, setDimBackground] = useState(false);
    const [saveCtaEnabled, setSaveCtaEnabled] = useState(false);

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

    const handleOnUpdatedBeachData = (data) => {
        console.log(`beachData: ${JSON.stringify(data)}`);

        const { image, beach, dateVisited } = data;
        const isValidData = image !== null
            && beach.name !== ''
            && dateVisited !== null

        currSnapData.current = data;
        setSaveCtaEnabled(isValidData);
    }

    const onDismiss = () => {
        // Reset values if needed such as below
        setSaveCtaEnabled(false);
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

    const handleOnSaveClick = async () => {
        if (currSnapData === null) {
            return;
        }

        console.log(`saveClick: ${JSON.stringify(currSnapData.current)}`)
        const _ = await DatabaseActions.saveSnap(
            generateParams(currSnapData)
        )

        setTimeout(() => {
            onSave();
        }, 200);
    }

    return (
        <FullScreenModal
            title='New beach snap'
            keyboardTitle='Caption'
            showSkipButton={showSkipButton}
            isKeyboardShown={isKeyboardShown}
            isVisible={isVisible}
            onClose={onClose}
            onDismiss={onDismiss}
            onHideKeyboard={hideKeyboard}
            onSkip={onSkip}
        >
            <BeachSnapEditor
                preselectedBeach={preselectedBeach}
                onSelectItem={handleOnSelectItem}
                onSelectDate={handleOnSelectDate}
                onChangeBeachName={handleOnChangeBeachName}
                onUpdatedBeachData={handleOnUpdatedBeachData}
            />
            {!isKeyboardShown &&
                <View>
                    <TouchableOpacity
                        style={saveCtaEnabled
                            ? {
                                ...styles.save,
                                marginBottom: insets.bottom + 10,
                            }
                            : {
                                ...styles.saveDisabled,
                                marginBottom: insets.bottom + 10,
                            }
                        }
                        onPress={handleOnSaveClick}
                    >
                        <Text
                            style={styles.saveCta}
                        >{strings.addThisSnap}</Text>
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
        fontFamily: DefaultFont.fontFamilyBold,
        fontSize: 20,
        alignSelf: 'center',
        color: 'white',
    },
    saveDisabled: {
        backgroundColor: 'lightgray',
        paddingVertical: 10,
        marginHorizontal: 20,
        marginBottom: 10,
        borderRadius: 10,
    },
});

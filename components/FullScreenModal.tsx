import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { DefaultFont } from '@/constants/Fonts';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const screenW = Dimensions.get('window').width;

export default function FullScreenModal({ 
    isVisible, 
    children,
    onClose,
    onHideKeyboard,
    onDismiss,
    onSkip,
    isKeyboardShown = false,
    title = 'Title',
    keyboardTitle = 'Keyboard',
    showSkipButton = false
}) {
    const insets = useSafeAreaInsets();

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            statusBarTranslucent={true}
            onDismiss={onDismiss}
        >
            <View style={styles.modalContent}>
                <View style={
                    {
                        ...styles.titleContainer,
                        marginTop: insets.top
                    }
                }>
                    <Text style={styles.title}>{
                        isKeyboardShown
                        ? keyboardTitle
                        : title
                    }</Text>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                ...styles.close,
                                opacity: showSkipButton ? 0 : 1,
                            }}
                            onPress={onClose}
                        >
                            <Ionicons name="chevron-back" color="black" size={22} />
                        </TouchableOpacity>
                        {(isKeyboardShown || showSkipButton) &&
                            <TouchableOpacity onPress={() => {
                                if (showSkipButton) {
                                    onSkip();
                                } else {
                                    onHideKeyboard();
                                }
                            }}>
                                <Text style={styles.ok}>
                                    {isKeyboardShown ? 'OK' : 'Skip'}
                                </Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
                {children}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContent: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        position: 'absolute',
    },
    titleContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    title: {
        fontFamily: DefaultFont.fontFamilyBold,
        fontSize: 20,
        alignSelf: 'center',
        color: 'green',
        position: 'absolute',
    },
    close: {
        paddingHorizontal: 20,
    },
    ok: {
        fontFamily: DefaultFont.fontFamilyBold,
        fontSize: 16,
        paddingHorizontal: 20,
    }
});


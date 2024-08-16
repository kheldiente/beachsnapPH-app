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
    isKeyboardShown = false,
    title = 'Title',
    keyboardTitle = 'Keyboard'
}) {
    const insets = useSafeAreaInsets();

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            statusBarTranslucent={true}
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
                            style={styles.close}
                            onPress={onClose}
                        >
                            <Ionicons name="chevron-back" color="black" size={22} />
                        </TouchableOpacity>
                        {isKeyboardShown &&
                            <TouchableOpacity onPress={onHideKeyboard}>
                                <Text style={styles.ok}>OK</Text>
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
        fontFamily: DefaultFont.fontFamily,
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: 'green',
        position: 'absolute',
    },
    close: {
        paddingHorizontal: 20,
    },
    ok: {
        fontFamily: DefaultFont.fontFamily,
        fontWeight: 'bold',
        fontSize: 16,
        paddingHorizontal: 20,
    }
});


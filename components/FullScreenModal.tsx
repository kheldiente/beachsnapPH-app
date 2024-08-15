import {
    Modal,
    View,
    Text,
    Pressable,
    StyleSheet,
    Dimensions
} from 'react-native';
import { DefaultFont } from '@/constants/Fonts';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const screenW = Dimensions.get('window').width;

export default function FullScreenModal({ isVisible, children, onClose, title = "Title" }) {
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
                    <Text style={styles.title}>{title}</Text>
                    <View
                        style={styles.close}
                    >
                        <Pressable
                            onPress={onClose}
                        >
                            <Ionicons name="chevron-back" color="black" size={22} />
                        </Pressable>
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
        color: 'green',
    },
    close: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        paddingHorizontal: 20,
    }
});


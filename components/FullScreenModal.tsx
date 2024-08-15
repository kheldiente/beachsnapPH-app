import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { DefaultFont } from '@/constants/Fonts';
import { Ionicons } from '@expo/vector-icons';

export default function FullScreenModal({ isVisible, children, onClose }) {
    return (
        <Modal animationType="slide" transparent={true} visible={isVisible}>
            <View style={styles.modalContent}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Add beach snap</Text>
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
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
        position: 'absolute',
        bottom: 0,
    },
    titleContainer: {
        height: '16%',
        backgroundColor: 'white',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        
    },
    close: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
    }
});


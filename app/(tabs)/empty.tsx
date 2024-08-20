import {
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function EmptyLayout() {
    return (
        <SafeAreaView
            style={styles.container} edges={['right', 'left']}
        >
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
    },
});
import { DefaultFont } from '@/constants/Fonts';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

export default function GalleryLayout() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Snaps</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: DefaultFont.fontFamily
  }
});

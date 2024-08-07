import { 
  View, 
  Text, 
  StyleSheet 
} from 'react-native';

export default function MapLayout() {
  return (
    <View style={styles.container}>
      <Text>Map</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

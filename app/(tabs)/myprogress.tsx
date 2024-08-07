import { 
  View, 
  Text, 
  StyleSheet 
} from 'react-native';

export default function MyProgressLayout() {
  return (
    <View style={styles.container}>
      <Text>My Progress</Text>
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

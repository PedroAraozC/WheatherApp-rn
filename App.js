
import { StyleSheet, View } from 'react-native';
import Weather from './index';
import AppNavigation from './navigation/appNavigation';

export default function App() {
  return (
    <View style={styles.container}>
      <AppNavigation/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

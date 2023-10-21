// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { View, Text, StyleSheet } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from './src/screens/homeScreen'
import LoginScreen from './src/screens/login'
import RegisterScreen from './src/screens/register'
import customerDashboard from './src/screens/customerDashboardScreen'

const Stack = createStackNavigator()

function StackNavigator(){
  return (
    <Stack.Navigator
      screenOptions = {{
        headerStyle: {backgroundColor: '#f1f1f1'},
        headerTintColor: 'black',
        headerTitleStyle: {fontWeight: 'bold'}
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Dashboard" component={customerDashboard} />
    </Stack.Navigator>
  )
}
export default function App(){
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  )
}




// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

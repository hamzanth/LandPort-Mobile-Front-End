import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image } from 'react-native';
// import { useNavigation } from '@react-navigation/native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';


export default function HomeScreen({ navigation }) {
  // const navigation = useNavigation()
  const handlePress = async () => {
    // console.log("Custom Button Pressed")
    const token = await AsyncStorage.getItem("userToken")
    // console.log(token)
    if (token){
      try{
        const decData = jwtDecode(token)
        // console.log(decData)
        if (decData.role === "customer"){
          navigation.navigate("CustomerDashboard")
        }
        else if (decData.role === "lmis"){
          navigation.navigate("LmisDashboard")
        }
        else if (decData.role === "rider"){
          navigation.navigate("RidersDashboard")
        }
        else{
          alert("Really dont know which category you are in")
        }
      }
      catch(error){
        console.log("Something went wrong")
      }
    }
    else{
      navigation.push('Login')
    }
  }
  return (
    <View style={styles.container}>
      <View style={{marginBottom: 100}}>
        <Image source={require("./finalLogo.png")} style={styles.brandLogo} resizeMode="cover" />
        <Text style={styles.subHeader}><Ionicons name="md-checkmark-circle" size={19} />For <Text style={styles.headAtrr}>Reliable</Text> and <Text style={styles.headAtrr}>Fast</Text> Delivery</Text>
      </View>
      <TouchableOpacity onPress={handlePress} >
        <Text style={styles.getStartedBtn}>Get Started</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'teal',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // container: {
  //   marginTop: 40,
  // },
  statBar: {
    marginTop: 40,
  },
  header: {
    textAlign: 'center',
    color: 'white',
    fontSize: 35,
    fontWeight: 'bold'
  },
  subHeader: {
    color: 'white',
    textAlign: "center",
  },
  headAtrr: {
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  brandLogo: {
    // backgroundColor: "black",
    height: 70,
    width: 300
  },
  getStartedBtn: {
    color: 'white',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 3,
    fontSize: 20,
  }
});

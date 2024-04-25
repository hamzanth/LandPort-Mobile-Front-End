import React, { useState, useEffect, useContext } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Image, Modal } from 'react-native';
import { Text, Button, IconButton, TextInput } from 'react-native-paper'
// import { useNavigation } from '@react-navigation/native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import * as Location from 'expo-location'
import MapView, {Marker, Callout} from 'react-native-maps'
import { TransContext } from '../../../../transactionContext';

export default function SenderDetail({navigation}){

    const transData = useContext(TransContext)

    const [ mapRegion, setMapRegion ] = useState(null)
    const [ pin, setPin ] = useState({})
    const [ pinnedLocation, setPinnedLocation ] = useState(null)
    const [ locationAccess, setLocationAccess ] = useState(false)
    const [ userLocation, setUserLocation ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ showModal, setShowModal ] = useState(false)
    const [ finalUserLocation, setFinalUserLocation ] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            // await AsyncStorage.removeItem("userToken")
            // navigation.navigate("Home")
            const { status } = await Location.requestForegroundPermissionsAsync()
            if ( status !== "granted"){
                // setLocationAccess(false)
                console.log("location not granted. Please enable your location in your settings")
                alert("location not granted")
            }
            else{
                // setLocationAccess(true)
                const currLocation = await Location.getCurrentPositionAsync()
                setMapRegion({
                    latitude: currLocation.coords.latitude,
                    longitude: currLocation.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                })
                setUserLocation({latitude: currLocation.coords.latitude, longitude: currLocation.coords.longitude})
                setPin({latitude: currLocation.coords.latitude, longitude: currLocation.coords.longitude})
                setLoading(false)
            }

        }
        fetchData()

    }, [])

    const handlePress = () => {
        // alert("button was pressed")
        // navigation.jumpTo("CustomerDashboard", { name: "Home"})
        // navigation.navigate("Reciever")
        setShowModal(true)
    }

    const handlePinned = () => {
        setShowModal(false)
        // navigation.navigate("Home")
        // alert("You are trying to pin something")
    }

    return(
        <View style={styles.container}>
            <Modal
                visible={showModal}
                style={{flex: 1}}
            >

                {!loading && (
                    <View style={{flex: 1}}>
                        <IconButton 
                            icon="check-bold"
                            rippleColor="#4caf50"
                            size={25}
                            iconColor="white"
                            containerColor="#3f51b5"
                            style={{alignSelf:"center", bottom: 15, right: 7, position: "absolute", zIndex: 70}}
                            onPress={handlePinned}
                        />
                        <MapView 
                            style={{flex: 1}} 
                            initialRegion={mapRegion}
                            provider="google"
                        >
                            <Marker 
                                coordinate={pin}
                                draggable={true}
                                onDragStart={(e) => console.log("Drag start " + e.nativeEvent.coordinate)}
                                onDragEnd={(e) => {
                                    setPin({latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude})
                                    transData.setSenderLocation({latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude})
                                }}
                            />
                        </MapView>
                    </View>
                )}

            </Modal>

            <Text variant="headlineSmall" style={{textAlign: "center", color: "teal", fontWeight: "bold", marginBottom: 50, marginTop: 15, width: "100%"}}>Enter Sender Details ({transData.rideType})</Text>
            <TextInput
                style={styles.inputStyle} 
                mode="outlined"
                label="Sender Name"
                value={transData.senderName}
                onChangeText={transData.setSenderName}
            />
            {/* <TextInput
                style={styles.inputStyle} 
                mode="outlined"
                label="Sender Location"
                value={transData.senderLocation}
                onChangeText={transData.setSenderLocation}
            /> */}
            <TextInput
                style={styles.inputStyle} 
                mode="outlined"
                label="Sender Phone Number"
                value={transData.senderPhoneNumber}
                keyboardType="numeric"
                onChangeText={transData.setSenderPhoneNumber}
            />
            <Button
                style={styles.recvLocation}
                rippleColor="#4caf50"
                mode="contained"
                buttonColor="teal"
                textColor="white"
                onPress={() => {
                    // setShowSendMapModal(true) 
                    // setVisible(false)
                    setShowModal(true)
                }}
            >
                Choose a New Location
            </Button>
            <Button
                style={styles.recvLocation}
                rippleColor="#4caf50"
                mode="contained"
                buttonColor="teal"
                textColor="white"
                onPress={() => {
                    setFinalUserLocation(pin)
                }}
            >
                Use Current Location
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    btnStyle: {
        
    },
    recvLocation: {
        borderRadius: 3,
        marginTop: 13,
        width: "70%",
        marginRight: "auto",
        marginLeft: "auto",
    },
    inputStyle: {
        marginBottom: 5,
        width: "80%",
        marginLeft: "auto",
        marginRight: "auto"
    },
})
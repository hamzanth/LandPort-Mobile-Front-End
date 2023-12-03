import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Dimensions, Modal } from 'react-native'
import { Portal, PaperProvider, Text, Button, TextInput, IconButton, MD3Colors } from 'react-native-paper'
import moment from 'moment'
import MapView, {Marker, Callout} from 'react-native-maps'
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwtDecode from 'jwt-decode'
import * as Location from 'expo-location'

export default function DashboardHomeRoute({ usr }){
    // console.log(customer)

    // const pinCoords = {
    //     latitude: 37.78825,
    //     longitude: -122.4324,
    // }

    const [ pin, setPin ] = useState({})
    const [ userLocation , setUserLocation ] = useState({})
    const [ mapRegion, setMapRegion ] = useState({})
    const [ user, setUser ] = useState(null)
    const [ loading, setLoading ] = useState(false)
    const [ buttonLoading, setButtonLoading ] = useState(false)
    const [ visible, setVisible ] = useState(false)
    const [ selectedForm, setSelectedForm ] = useState(0)
    const [ senderName, setSenderName ] = useState("")
    const [ senderLocation, setSenderLocation ] = useState("")
    const [ senderPhoneNumber, setSenderPhoneNumber ] = useState("")
    const [ recieverName, setRecieverName ] = useState("")
    const [ recieverLocation, setRecieverLocation ] = useState("")
    const [ recieverPhoneNumber, setRecieverPhoneNumber ] = useState("")
    const [ productName, setProductName ] = useState("")
    const [ productQuantity, setProductQuantity ] = useState("")
    const [ productImage, setProductImage ] = useState("")
    const [ request, setRequest ] = useState({})
    const [ showTransDetail, setShowTransDetail ] = useState(false)
    const [ selectedTrans, setSelectedTrans ] = useState({})
    const [ modalVisible, setModalVisible ] = useState(false)
    const [ isMapReady, setIsMapReady ] = useState(false)
    const [ locationAccess, setLocationAccess ] = useState(false)

    const initialRegion = {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    }

    useEffect(() => {
        const fetchData = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync()
            if ( status !== "granted"){
                setLocationAccess(false)
                console.log("location not granted. Please enable your location in your settings")
            }
            else{
                setLocationAccess(true)
                const currLocation = await Location.getCurrentPositionAsync()
                setMapRegion({
                    latitude: currLocation.coords.latitude,
                    longitude: currLocation.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                })
                setUserLocation({latitude: currLocation.coords.latitude, longitude: currLocation.coords.longitude})
                setPin({latitude: currLocation.coords.latitude, longitude: currLocation.coords.longitude})
                // console.log(currLocation)
            }
    //         const data = await AsyncStorage.getItem("userToken")
    //         try{
    //             const decData = jwtDecode(data)
    //             await fetch("http://192.168.43.207:3000/users/" + decData.id)
    //             .then(resp => resp.json())
    //             .then(data => {
    //                 setUser(data.user)
    //                 setLoading(false)
    //             })
    //             .catch(error => {
    //                 console.log(error)
    //             })
    //         }
    //         catch(error){
    //             console.log("something went wrong")
    //         }
        }
        fetchData()

    }, [])

    const calculateDistance = (userCoords, recvCoords) => {
        const toRadian = n => (n * Math.PI) / 180
        const R = 6371
        const lat2 = recvCoords.latitude
        const lon2 = recvCoords.longitude
        const lat1 = userCoords.latitude
        const lon1 = userCoords.longitude
        const x1 = lat2 - lat1
        const dLat = toRadian(x1)
        const x2 = lon2 - lon1
        const dLon = toRadian(x2)
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadian(lat1)) * Math.cos(toRadian(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const d = R * c
        return d
    }

    const handleAnotherRequest = async () => {
        console.log("we are here")
        console.log(userLocation)
        console.log(pin)
        // setPin(userLocation)

        const distance = calculateDistance(userLocation, pin)
        console.log(`The distance is ${distance} km`)

        setVisible(false)
        setSelectedForm(0)
    }

    const handleMakeRequest = async () => {
        await fetch("http://192.168.43.207:3000/transactions/" + usr._id + "/make-request", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                senderName: senderName,
                senderLocation: senderLocation,
                senderPhoneNumber: senderPhoneNumber,
                receiverName: recieverName,
                receiverLocation: recieverLocation,
                receiverPhoneNumber: recieverPhoneNumber,
                productName: productName,
                productQuantity: productQuantity,
                productImage: productImage
            })
        })
        .then(resp => resp.json())
        .then(data => {
            console.log(data.request)
            alert("request has been made successfully, wait a moment for response")
            setVisible(false)
        })
        .catch(error => alert(error))
    }
    const goForward = () => {
        if(selectedForm > 1)
        {
            setSelectedForm(0)
        }
        else{
            const newPart = selectedForm + 1
            setSelectedForm(newPart)
        }
    }
    const goBackward = () => {
        if(selectedForm < 1)
        {
            setSelectedForm(2)
        }
        else{
            const newPart = selectedForm - 1
            setSelectedForm(newPart)
        }
    }
    const handleDismiss = () => {
        setSelectedForm(0)
        setVisible(false)
    }
    const handleTransDetails = (trans) => {
        setSelectedTrans(trans)
        setShowTransDetail(true)
    }
    const handleTransDetailClose = () => {
        setSelectedTrans({})
        setShowTransDetail(false)
    }
    const onMapLayout = () => {
        setIsMapReady(true)
    }
    const handleModalClose = () => {
        setVisible(false)
    }
    return(
        <PaperProvider>
            {showTransDetail && (
                <View style={styles.transModal}>
                    <IconButton 
                        icon="close"
                        rippleColor="#4caf50"
                        size={30}
                        iconColor="white"
                        containerColor="red"
                        style={{alignSelf:"center", marginTop: 15}}
                        onPress={handleTransDetailClose}
                    />
                    <View>
                        <Text variant="headlineLarge" style={{textAlign: "center", marginBottom: 10}}>{selectedTrans.refNumber}</Text>
                        <Text variant="bodyLarge" style={{textAlign: "center", marginBottom: 10}}>Date: {moment(selectedTrans.dateCreated).calendar()} ({moment(selectedTrans.dateCreated).fromNow()})</Text>
                        <Text variant="bodyLarge" style={{textAlign: "center", marginBottom: 10}}>Completed: {selectedTrans.completed ? "True" : "False"} </Text>
                        <Text variant="bodyLarge" style={{textAlign: "center", marginBottom: 10}}>Transaction Cost: #{selectedTrans.transactionCost}</Text>
                        <Text variant="bodyLarge" style={{textAlign: "center", marginBottom: 10}}>Sender: {selectedTrans.customer.name} (0{selectedTrans.customer.phoneNumber})</Text>
                        <Text variant="bodyLarge" style={{textAlign: "center", marginBottom: 10}}>Reciever: {selectedTrans.request.recipient.name} (0{selectedTrans.request.recipient.phoneNumber})</Text>
                        <Text variant="bodyLarge" style={{textAlign: "center", marginBottom: 10}}>Rider's Company: {selectedTrans.riderCompany.name}</Text>
                        
                    </View>
                </View>
            )}
            <View style={[styles.container, {justifyContent: loading ? "center" : "flex-start"}]}>
                    {loading ? (
                        <View>
                            <ActivityIndicator size="large" color="white" />
                        </View>
                    ): (
                        <View style={styles.showCont}>
                            <Portal>
                                <Modal 
                                    visible={visible} 
                                    // onDismiss={handleDismiss}
                                    // dismissableBackButton={true}
                                    // style={styles.modalStyles}
                                >
                                    <View style={{display: selectedForm === 0 ? "flex" : "none"}}>
                                    <Text variant="bodyLarge" style={{textAlign: "center", marginTop: 10}}>Select Receiver's Location</Text>
                                    <IconButton 
                                        icon="close"
                                        rippleColor="#4caf50"
                                        size={30}
                                        iconColor="white"
                                        containerColor="red"
                                        style={{alignSelf:"center", top: 15, right: 7, position: "absolute", zIndex: 70}}
                                        onPress={handleModalClose}
                                    />
                                    {/* <Text variant="labelMedium" style={{textAlign: "center", marginVertical: 16}}>Enter your(sender) Details</Text> */}
                                        {/* <TextInput
                                            style={styles.inputStyle} 
                                            mode="outlined"
                                            label="Sender Name"
                                            value={senderName}
                                            onChangeText={setSenderName}
                                        />
                                        <TextInput
                                            style={styles.inputStyle} 
                                            mode="outlined"
                                            label="Sender Location"
                                            value={senderLocation}
                                            onChangeText={setSenderLocation}
                                        />
                                        <TextInput
                                            style={styles.inputStyle} 
                                            mode="outlined"
                                            label="Sender Phone Number"
                                            value={senderPhoneNumber}
                                            keyboardType="numeric"
                                            onChangeText={setSenderPhoneNumber}
                                        /> */}
                                        <MapView 
                                            style={styles.map} 
                                            initialRegion={mapRegion}
                                            provider="google"
                                            onMapReady={onMapLayout}
                                            showUserLocation={true}
                                        >
                                            <Marker 
                                                coordinate={pin}
                                                draggable={true}
                                                onDragStart={(e) => console.log("Drag start " + e.nativeEvent.coordinate)}
                                                onDragEnd={(e) => {
                                                    setPin({latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude})
                                                    setSelectedForm(2)
                                                }}
                                            />
                                        </MapView>
                                    </View>
                                    <View style={{display: selectedForm === 1 ? "flex" : "none", marginHorizontal: 15,}}>
                                        <Text variant="labelMedium" style={{textAlign: "center", marginVertical: 16}}>Enter receiver Details</Text>
                                        {/* <TextInput
                                            style={styles.inputStyle} 
                                            mode="outlined"
                                            label="Reciever Name"
                                            value={recieverName}
                                            onChangeText={setRecieverName}
                                        />
                                        <TextInput
                                            style={styles.inputStyle} 
                                            mode="outlined"
                                            label="Reciever Location"
                                            value={recieverLocation}
                                            onChangeText={setRecieverLocation}
                                        />
                                        <TextInput
                                            style={styles.inputStyle} 
                                            mode="outlined"
                                            label="Reciever Phone Number"
                                            value={recieverPhoneNumber}
                                            keyboardType="numeric"
                                            onChangeText={setRecieverPhoneNumber}
                                        /> */}
                                        {/* <MapView 
                                            style={styles.map} 
                                            initialRegion={initialRegion}
                                            provider="google"
                                        >
                                            <Marker 
                                                coordinate={pinCoords}
                                                draggable={true}
                                                onDragStart={(e) => console.log("Drag start " + e.nativeEvent.coordinate)}
                                                onDragEnd={(e) => {
                                                    setPin({latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude})
                                                }}
                                            />
                                        </MapView> */}

                                    </View>
                                    <View style={{display: selectedForm === 2 ? "flex" : "none", marginHorizontal: 15, paddingTop: 50}}>
                                        <Text variant="labelMedium" style={{textAlign: "center", marginVertical: 16}}>Enter Product Details</Text>
                                        <IconButton 
                                            icon="close"
                                            rippleColor="#4caf50"
                                            size={30}
                                            iconColor="white"
                                            containerColor="red"
                                            style={{alignSelf:"center", top: 15, right: 7, position: "absolute", zIndex: 70}}
                                            onPress={handleModalClose}
                                        />
                                        <TextInput
                                            style={styles.inputStyle} 
                                            mode="outlined"
                                            label="Product Name"
                                            value={productName}
                                            onChangeText={setProductName}
                                        />
                                        <TextInput
                                            style={styles.inputStyle} 
                                            mode="outlined"
                                            label="Product Quantity"
                                            value={productQuantity}
                                            onChangeText={setProductQuantity}
                                        />
                                        <TextInput
                                            style={styles.inputStyle} 
                                            mode="outlined"
                                            label="Product Image"
                                            value={productImage}
                                            onChangeText={setProductImage}
                                        />
                                        <Button
                                            style={styles.mfinal}
                                            rippleColor="#4caf50"
                                            mode="contained"
                                            buttonColor="black"
                                            textColor="white"
                                            loading={loading}
                                            onPress={handleAnotherRequest}
                                        >
                                            make request
                                        </Button>
                                    </View>
                                    <View style={styles.navButtons}>
                                        <IconButton
                                            rippleColor="#4caf50"
                                            icon="arrow-left-bold"
                                            size={30}
                                            iconColor="black"
                                            containerColor="white"
                                            onPress={goBackward}                                      
                                        />
                                        <IconButton
                                            rippleColor="#4caf50"
                                            icon="arrow-right-bold"
                                            size={30}
                                            iconColor="black"
                                            containerColor="white"
                                            onPress={goForward}                                      
                                        />
                                    </View>
                                </Modal>
                            </Portal>
                            <Text variant="headlineMedium" style={styles.header}>Welcome {usr && usr.name}</Text>
                            <Button
                                textColor="black"
                                buttonColor="white"
                                mode="contained"
                                rippleColor="#4caf50"
                                style={styles.mrButton}
                                onPress={() => setVisible(true)}
                            >
                                make request
                            </Button>
                            <View style={{position: "absolute", top: 200}}>
                                <Text variant="headlineLarge" style={{color: "white", textAlign: "center"}}>Recent Links</Text>
                                <FlatList 
                                    keyExtractor={(item) => item._id}
                                    data={usr.transactions}
                                    renderItem={({item}) => (
                                        <View>
                                            <TouchableOpacity onPress={() => handleTransDetails(item)}>
                                                <Text variant="bodyLarge" style={{textAlign: "center", borderColor: "white", borderWidth: 1, marginBottom:3, borderRadius: 5, color: "white"}}>{item.refNumber}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                />
                            </View>
                        </View>  
                    )}
                </View>
            </PaperProvider>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "teal",
        alignItems: "center",
        paddingTop: 30
    },
    showCont: {
        flex: 1,
        alignItems: "center"
    },
    header: {
        // textAlign: "center",
        color: "white",
    },
    modalStyles: {
        backgroundColor: "white", 
        height: 400, 
        width: "70%", 
        marginLeft: "15%", 
        justifyContent: "flex-start"
    },
    mrButton: {
        width: 150,
        paddingVertical: 0,
        paddingHorizontal: 0,
        position: "absolute",
        top: 140,
    },
    inputStyle: {
        marginBottom: 5,
    },
    navButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        // position: "absolute",
        // bottom: 0
    },
    mfinal: {
        borderRadius: 3,
        marginTop: 13
    },
    requestStyle: {
        // flexDirection: "row"
    },
    transModal: {
        position: "absolute",
        top: "0%",
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        zIndex: 30,
    },
    map: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height
    }
})
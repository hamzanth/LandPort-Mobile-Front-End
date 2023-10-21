import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { Modal, Portal, PaperProvider, Text, Button, TextInput, IconButton, MD3Colors } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwtDecode from 'jwt-decode'

export default function DashboardHomeRoute({ customer }){
    // console.log(customer)
    const [ user, setUser ] = useState(null)
    const [ loading, setLoading ] = useState(true)
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

    useEffect(() => {
        const fetchData = async () => {
            const data = await AsyncStorage.getItem("userToken")
            try{
                const decData = jwtDecode(data)
                await fetch("http://192.168.43.207:3000/users/" + decData.id, {
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
                    setUser(data.user)
                    setLoading(false)
                })
                .catch(error => {
                    console.log(error)
                })
            }
            catch(error){
                console.log("something went wrong")
            }
        }
        fetchData()

    }, [])
    const handleMakeRequest = async () => {
        await fetch("http://192.168.43.207:3000/transactions/" + user._id + "/make-request")
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
    return(
        <PaperProvider>
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
                                    onDismiss={handleDismiss}
                                    dismissableBackButton={true}
                                    style={styles.modalStyles}
                                >
                                    <Text variant="bodyLarge" style={{textAlign: "center", marginTop: 10}}>Request Form</Text>
                                    <View style={{display: selectedForm === 0 ? "flex" : "none", marginHorizontal: 15}}>
                                        <Text variant="labelMedium" style={{textAlign: "center", marginVertical: 16}}>Enter your(sender) Details</Text>
                                        <TextInput
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
                                        />
                                    </View>
                                    <View style={{display: selectedForm === 1 ? "flex" : "none", marginHorizontal: 15,}}>
                                        <Text variant="labelMedium" style={{textAlign: "center", marginVertical: 16}}>Enter receiver Details</Text>
                                        <TextInput
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
                                        />
                                    </View>
                                    <View style={{display: selectedForm === 2 ? "flex" : "none", marginHorizontal: 15}}>
                                        <Text variant="labelMedium" style={{textAlign: "center", marginVertical: 16}}>Enter Product Details</Text>
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
                                            onPress={handleMakeRequest}
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
                            <Text variant="headlineMedium" style={styles.header}>Welcome {user && user.name}</Text>
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
        top: 190,
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
    }
})
import React, { useContext } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper'
// import { useNavigation } from '@react-navigation/native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import { TransContext } from '../../../../transactionContext';


export default function ProductDetail({navigation}){

    const transData = useContext(TransContext)

    const handlePress = () => {
        // alert("button was pressed")
        // navigation.jumpTo("CustomerDashboard", { name: "Home"})
        navigation.navigate("Home")
    }

    const handleMakeRequest = async () => {
        // alert("make request button was pressed")
        const data = await AsyncStorage.getItem("userToken")
        const decData = jwtDecode(data)
        await fetch("http://192.168.43.75:3000/transactions/" + decData.id + "/make-request", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                senderName: transData.senderName,
                senderLocation: transData.senderLocation,
                senderPhoneNumber: transData.senderPhoneNumber,
                receiverName: transData.recieverName,
                receiverLocation: transData.recieverLocation,
                receiverPhoneNumber: transData.recieverPhoneNumber,
                productName: transData.productName,
                productQuantity: transData.productQuantity,
                productImage: transData.productImage
            })
        })
        .then(resp => resp.json())
        .then(data => {
            // console.log(data.request)
            // alert(data.message)
            // setUsr(data.usr)
            alert("transaction created successfully")
            navigate("Home")
            
        })
        .catch(error => alert(error))
    }

    return(
        <View>
            <Text variant="headlineSmall" style={{textAlign: "center", color: "teal", fontWeight: "bold", marginBottom: 50, marginTop: 15, width: "100%"}}>Enter Product Details</Text>
            <TextInput
                style={styles.inputStyle} 
                mode="outlined"
                label="Product Name"
                value={transData.productName}
                onChangeText={transData.setProductName}
            />
            <TextInput
                style={styles.inputStyle} 
                mode="outlined"
                label="Product Quantity"
                keyboardType='numeric'
                value={transData.productQuantity}
                onChangeText={transData.setProductQuantity}
            />
            <TextInput
                style={styles.inputStyle} 
                mode="outlined"
                label="Product Image"
                value={transData.productImage}
                onChangeText={transData.setProductImage}
            />
            <Button
                style={styles.recvLocation}
                rippleColor="#4caf50"
                mode="contained"
                buttonColor="teal"
                textColor="white"
                onPress={handleMakeRequest}
            >
                Make Request
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
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
import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { Text, TextInput, Button } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function RegisterScreen({navigation}){
    const [ customerDetail, setCustomerDetail ] = useState([])
    const [ name, setName ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ phoneNumber, setPhoneNumber ] = useState("")
    const [ location, setLocation ] = useState("")
    const [ loading, setLoading ] = useState(false)

    const handleRegister = () => {
        setLoading(true)
        fetch("http://192.168.43.75:3000/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                password: password,
                email: email,
                phoneNumber: phoneNumber,
                location: location
            })
        })
        .then(resp => resp.json())
        .then( async (data) => {
            console.log(data)
            await AsyncStorage.setItem("userToken", data.token)
            setLoading(false)
            navigation.replace("CustomerDashboard")
        }) 
        .catch(error => alert(error))
    }

    return (
        <View style={styles.container}>
            <Text variant="bodyLarge" style={{color: "white", marginTop: 30}}>Sign Up To create An Account</Text>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.inputStyle} 
                    mode="outlined"
                    label="name"
                    value={name}
                    onChangeText={(text) => setName(text)}
                />
                <TextInput
                    style={styles.inputStyle} 
                    mode="outlined"
                    label="password"
                    value={password}
                    secureTextEntry={true}
                    onChangeText={(text) => setPassword(text)}
                />
                <TextInput 
                    style={styles.inputStyle}
                    mode="outlined"
                    label="email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    inputMode='email'
                />
                <TextInput 
                    style={styles.inputStyle}
                    mode="outlined"
                    label="address"
                    value={location}
                    onChangeText={(text) => setLocation(text)}
                />
                <TextInput 
                    style={styles.inputStyle}
                    mode="outlined"
                    label="Phone Number"
                    value={phoneNumber}
                    keyboardType="numeric"
                    onChangeText={setPhoneNumber}
                />
                <Button
                    style={styles.regBtn}
                    icon="account-plus"
                    rippleColor="#4caf50"
                    mode="outlined"
                    buttonColor="white"
                    textColor="black"
                    loading={loading}
                    onPress={handleRegister}
                >
                    Sign Up
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: 'teal',
    },
    formContainer: {
        position: "absolute",
        top: "19%",
        width: "70%",
    },
    regBtn: {
        borderRadius: 3,
        marginTop: 15,
    },
    inputStyle: {
        // borderWidth: 1,
        // borderColor: 'black'
        // color: "black",
        fontSize: 16,
        width: "100%",
        height: 30,
        padding: 10,
        backgroundColor: 'white',
        marginBottom: 5
    },
})
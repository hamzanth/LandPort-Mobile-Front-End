import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text, Button } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function RidersDashProfile({user}){

    const navigation = useNavigation()
    
    const handleLogout = async () => {
        await AsyncStorage.removeItem("userToken")
        navigation.navigate("Home")
    }

    return (
        <View>
            <Text style={{textAlign: "center", marginVertical: 19}}>Riders Profile Screen</Text>
            <View style={{flexDirection: "row", justifyContent: "center"}}>
            <Button 
                style={styles.logoutBtn}
                buttonColor="black"
                textColor="white"
                rippleColor="#4caf50"
                mode="contained"
                onPress={handleLogout}
            >
                Logout
            </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    logoutBtn: {
        width: "30%",
        padding: 0
    }
})
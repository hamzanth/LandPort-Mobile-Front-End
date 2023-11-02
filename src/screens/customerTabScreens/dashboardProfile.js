import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, Button } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function DashboardProfileRoute(){
    const navigation = useNavigation()
    const handleLogout = async () => {
        await AsyncStorage.removeItem("userToken")
        navigation.navigate("Home")
    }
    return(
        <View style={styles.container}>
            <Text>This is the Dash board Profile tab</Text>
            <Button
                style={styles.logoutBtn}
                rippleColor="#4caf50"
                buttonColor='white'
                mode="elevated"
                textColor='black'
                onPress={handleLogout}
            >
                Logout
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 30
    },
    logoutBtn: {
        width: 150
    }

})
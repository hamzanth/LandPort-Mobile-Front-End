import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { Modal, Portal, PaperProvider, Text, Button } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwtDecode from 'jwt-decode'

export default function DashboardHomeRoute({ customer }){
    // console.log(customer)
    const [ user, setUser ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ visible, setVisible ] = useState(false)
    useEffect(() => {
        const fetchData = async () => {
            const data = await AsyncStorage.getItem("userToken")
            try{
                const decData = jwtDecode(data)
                await fetch("http://192.168.43.207:3000/users/" + decData.id)
                .then(resp => resp.json())
                .then(data => {
                    setUser(data.customer)
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
    const handleMakeRequest = () => {
        // alert("request has been made successfully, wait a moment for response")
        setVisible(true)
    }
    return(
        <View style={[styles.container, {justifyContent: loading ? "center" : "flex-start"}]}>
                {loading ? (
                    <View>
                        <ActivityIndicator size="large" color="white" />
                    </View>
                ): (
                <PaperProvider>
                    <View style={styles.showCont}>
                        <Portal>
                            <Modal 
                                visible={visible} 
                                onDismiss={() => setVisible(false)}
                                dismissableBackButton={true}
                                style={{backgroundColor: "white", height: 400}}
                            >
                                <Text>This is the modal</Text>
                            </Modal>
                        </Portal>
                        <Text variant="headlineMedium" style={styles.header}>Welcome {user && user.name}</Text>
                        <Button
                            textColor="black"
                            buttonColor="white"
                            mode="contained"
                            rippleColor="#4caf50"
                            style={styles.mrButton}
                            onPress={handleMakeRequest}
                        >
                            make request
                        </Button>
                    </View>  
                </PaperProvider>
                )}
            </View>

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
    mrButton: {
        width: 150,
        paddingVertical: 0,
        paddingHorizontal: 0,
        position: "absolute",
        top: 190
    }
})
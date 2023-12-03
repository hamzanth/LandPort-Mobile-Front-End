import React, { useState, useEffect } from 'react'
import { StyleSheet, View, FlatList, Modal, TouchableOpacity, Alert } from 'react-native'
import { Text, IconButton } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'

export default function LmisDashHome(){
    const [ requests, setRequests ] = useState([])
    const [ riders, setRiders ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ showModal, setShowModal ] = useState(false)
    const [ selectedRequest, setSelectedRequest ] = useState({})
    useEffect(() => {
        const fetchData = async () => {
            await fetch("http://192.168.43.207:3000/transactions/unapproved-requests")
            .then(resp => resp.json())
            .then(data => {
                console.log(data.requests)
                setRequests(data.requests)
            })
            .catch(error => console.log(error))

            await fetch("http://192.168.43.207:3000/users/riders-company/get-companies")
            .then(resp => resp.json())
            .then(data => {
                setRiders(data.riders)
                setLoading(false)
            })
            .catch(err => console.log(err))
        }
        fetchData()
    }, [])

    const handleModalClose = () => {
        setSelectedRequest({})
        setShowModal(false)
    }

    const handleModalOpen = (reqs) => {
        setSelectedRequest(reqs)
        console.log(reqs)
        setShowModal(true)
    }

    const handleYesPress = async (rider) => {
        // console.log(`The rider clicked is ${rider.name}`)
        await fetch("http://192.168.43.207:3000/transactions/create-transaction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({senderName: selectedRequest.sender.name, request: selectedRequest, rider: rider})
        })
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
        })
        .catch(error => console.log(error))
    }

    const handleRiderPress = (rider) => {
        Alert.alert("Confirm Selection", `Are you Sure you want to select ${rider.name}`, [
            {text: "Yes", onPress:() => handleYesPress(rider)},
            {text: "No, Cancel", onPress:() => console.log("Transaction Aborted")},
        ])
    }

    return (
        <View style={[styles.container, {justifyContent: loading ? "center" : "flex-start"}]}>
            {loading ? (
                <Text variant="bodyMedium">Loading Requests</Text>
            ) : (
                // <Text variant="bodyMedium">Finished Loading Requests</Text>
                <View>
                    {/* {showModal && (
                        <View style={styles.modalStyle}>
                            <Text variant="bodyLarge" style={{textAlign: "center"}}>Choose a Rider's Company</Text>

                        </View>
                    )} */}
                    <Modal visible={showModal}>
                        <View style={{flex: 1, justifyContent: "center"}}>
                            <View style={{position: "absolute", top: 19, width: "100%"}}>
                                <IconButton 
                                    icon="close"
                                    rippleColor="#4caf50"
                                    size={30}
                                    iconColor="white"
                                    containerColor="red"
                                    style={{alignSelf:"center", marginTop: 15}}
                                    onPress={handleModalClose}
                                />
                                <Text variant="headlineSmall" style={{textAlign: "center"}}>Choose a Rider's Company</Text>
                            </View>
                            {riders.length === 0 ? (
                                <Text style={{marginTop: 17, textAlign: "center"}}>There is no available Rider's Company at the moment</Text>
                                ) : (
                                    <View style={{marginTop: 30}}>
                                        <FlatList 
                                            keyExtractor={item => item._id}
                                            data={riders}
                                            renderItem={({item}) => (
                                                <View style={styles.ridersViewStyle}>
                                                    <TouchableOpacity style={styles.ridersTextStyle} onPress={() => handleRiderPress(item)}>
                                                        <Text style={{textAlign: "center", paddingVertical: 10}}>{item.name} (#{item.priceCharged})</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                        />
                                    </View>
                            )}

                        </View>
                    </Modal>
                    <Text variant="headlineMedium" style={{textAlign: "center", marginVertical: 11, color: "white"}}>Recent Requests</Text>
                    {requests.length === 0 ? (
                        <Text variant="bodyLarge" style={{color: "white"}}>There are no request for now</Text>
                    ) : (
                        <FlatList 
                            keyExtractor={(item) => item._id}
                            data={requests}
                            renderItem={({item}) => (
                                <View style={styles.ridersViewStyle}>
                                    <TouchableOpacity>
                                        <Text 
                                            style={styles.listStyle}
                                            onPress={() => handleModalOpen(item)} 
                                        >
                                            {`${item.sender.name} => ${item.recipient.name} (${item.product.name})`}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    )}
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "teal",
        alignItems: "center"
    },
    modalStyle: {
        position: "absolute",
        width: "80%",
        height: "70%",
        backgroundColor: "white",
        top: 100,
        left: 30
    },
    ridersViewStyle: {
        flexDirection: "row", 
        justifyContent: "center", 
        alignItems: "center", 
        marginVertical: 5,
        // borderColor: "red",
        // borderWidth: 3
    },
    ridersTextStyle: { 
        // borderWidth: 2, 
        borderWidth: 1, 
        borderColor: "black", 
        borderStyle: "solid", 
        borderRadius: 5, 
        width: "70%"
    },
    listStyle: {
        color: "white", 
        fontSize: 17, 
        textAlign: "center", 
        width: "80%", 
        borderWidth: 2, 
        borderColor: "white",
        borderRadius: 3,
        marginLeft: "auto",
        marginRight: "auto"
    }
})
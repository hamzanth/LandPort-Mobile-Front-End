import React, { useEffect, useState, useContext } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, FlatList, Alert, Modal as Lmodal, Image } from 'react-native';
import { Text, Button, ActivityIndicator, IconButton, Modal, Portal, PaperProvider } from 'react-native-paper'
// import { useNavigation } from '@react-navigation/native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import { TransContext } from '../../../../transactionContext';
import { Entypo } from '@expo/vector-icons'
import { Card } from 'react-native-shadow-cards'
import moment from 'moment'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { NavigationHelpersContext } from '@react-navigation/native';


export default function InitHome({navigation}){

    const transData = useContext(TransContext)

    const dropDownData = [
        {title: "single", icon: "arrow-right"}, 
        {title: "mass", icon: "home"}, 
        {title: "shared", icon: "cog"}, 
        {title: "global", icon: "heart"}
        ]

    const [ loading, setLoading ] = useState(true)
    const [ usr, setUsr ] = useState(null)
    const [ showTransDetail, setShowTransDetail ] = useState(false)
    const [ selectedTrans, setSelectedTrans ] = useState(null)
    const [ bookChoice, setBookChoice ] = useState("Single")
    const [ showBookModal, setShowBookModal ] = useState(false)

    useEffect(() => {
        const fetchData = async () => {

            const data = await AsyncStorage.getItem("userToken")
            console.log(data)
            try{
                const decData = jwtDecode(data)
                await fetch("http://192.168.43.75:3000/users/" + decData.id)
                .then(resp => resp.json())
                .then(data => {
                    console.log(data)
                    setUsr(data.user)
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
        // alert("button was pressed")
        // navigation.jumpTo("CustomerDashboard", { name: "Home"})
        Alert.alert("Request", "Select request type to make", [
            {text: "Single Rider", onPress: () => alert("single rider requested")},
            {text: "Mass Rider", onPress: () => alert("Mass rider requested")},
        ])
        // navigation.navigate("Sender")
    }

    const handleTransDetailClose = () => {
        setSelectedTrans(null)
        setShowTransDetail(false)
    }

    const handleConfirmButton = () => {
        alert("transaction confirmed")
    }

    return(
        <PaperProvider>

            <View style={styles.container}>
                {loading ? (
                    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                        <ActivityIndicator size="large" color="teal" animating={true} />
                    </View>
                ): (
                <View style={styles.showCont}>
                    <Portal>
                        <Modal
                            visible={showBookModal}
                            onDismiss={() => setShowBookModal(false)}
                            contentContainerStyle={{borderColor: "teal", borderWidth: 3, marginLeft: "auto", marginRight: "auto", marginTop: -30, backgroundColor: "white"}}
                        >
                            <View style={{paddingVertical: 5}}>
                                <Text style={{fontSize: 20, marginBottom: 12, paddingHorizontal: 10}}>Select the type of Ride</Text>
                                <FlatList 
                                    keyExtractor={(item) => item.title}
                                    data={dropDownData}
                                    renderItem={({item}) => (
                                        <View>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    transData.setRideType(item.title)
                                                    navigation.navigate("Sender")
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 20,
                                                        textAlign: "center",
                                                        // borderBottomWidth: 1,
                                                        marginBottom: 6 
                                                    }}
                                                >
                                                    {item.title}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                />
                            </View>
                        </Modal>
                    </Portal>

                        <Lmodal
                            visible={showTransDetail}
                            onDismiss={() => setShowTransDetail(false)}
                            animationType='slide'
                            // transparent={true}
                            onRequestClose={() => {
                                // Alert.alert("Modal has been closed")
                                setShowTransDetail(false)
                                // setSelectedRider(null)
                            }}
                        >
                        <View style={styles.transModal}>
                            <IconButton 
                                icon="close"
                                rippleColor="#4caf50"
                                size={30}
                                iconColor="red"
                                // containerColor="red"
                                style={{
                                    // alignSelf:"right", 
                                    marginTop: 0, 
                                    borderColor: "red", 
                                    borderWidth: 4,
                                    position: "absolute",
                                    top: 10,
                                    right: 10
                                }}
                                onPress={handleTransDetailClose}
                            />
                            
                            <View>
                                {selectedTrans && (
                                    <View>
                                        <Image 
                                            source = {require("../../../assets/mark.jpg")}
                                            style = {styles.brandLogo}
                                            resizeMode = "cover" 
                                        />

                                        <Text variant="headlineLarge" style={{textAlign: "center", marginVertical: 10, color: "white", borderWidth: 0.5, backgroundColor: "teal"}}>{selectedTrans.refNumber}</Text>
                                        <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Date: {moment(selectedTrans.dateCreated).calendar()} ({moment(selectedTrans.dateCreated).fromNow()})</Text>
                                        <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Completed: {selectedTrans.completed ? "True" : "False"} </Text>
                                        <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Distance: {selectedTrans.distance?.toFixed(2)}KM</Text>
                                        <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Transaction Cost: #{selectedTrans.transactionCost}</Text>
                                        <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Customer: {selectedTrans.customer?.name} (0{selectedTrans.customer?.phoneNumber})</Text>
                                        <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Sender: {selectedTrans.request[0].sender.name} (0{selectedTrans.customer?.phoneNumber})</Text>
                                        <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Reciever: {selectedTrans.request[0].recipient.name} (0{selectedTrans.request[0].recipient.phoneNumber})</Text>
                                        <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Rider's Company: {selectedTrans.riderCompany?.name}</Text>
                                        <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Product: {selectedTrans.request[0].product.name}({selectedTrans.request[0].product.quantity})</Text>
                                    </View>
                                )}
                                
                                
                            </View>
                            <View style={{marginTop: 30}}>
                                <Button 
                                    style={styles.confirmButton}
                                    mode="contained"
                                    rippleColor="#4caf50"
                                    icon="check"
                                    buttonColor="teal"
                                    textColor="white"
                                    onPress={() => handleConfirmButton(selectedTrans)}
                                    disabled={usr.riderConfirm ? true : false}
                                >
                                    Confirm
                                </Button>
                            </View>
                        </View>
                    </Lmodal>

                    <View style={styles.linkView}>
                        <Text variant="headlineMedium" style={styles.header}>Welcome {usr && usr.name}</Text>
                    </View>
                    <Button
                        textColor="white"
                        buttonColor="teal"
                        mode="contained"
                        rippleColor="#4caf50"
                        style={styles.mrButton}
                        onPress={() => setShowBookModal(true)}
                    >
                        Book A Ride
                    </Button>
                    

                    {/* <Dropdown 
                        label="Book A Rider"
                        data={dropDownData}
                    /> */}

                    <View style={{flex: 1}}>
                        <Text variant="headlineMedium" style={{textAlign: "center", color: "teal"}}>Recent Links</Text>
                        <FlatList 
                            keyExtractor={(item) => item._id}
                            data={usr.transactions}
                            renderItem={({item}) => (
                            
                                <Card style={styles.cardStyle}>
                                    <TouchableOpacity onPress={() => {
                                        setSelectedTrans(item)
                                        // console.log(item.request.length)
                                        setShowTransDetail(true)
                                    }}>
                                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-around"}}>
                                            <Entypo name="cross" size={33} style={{color: "white", backgroundColor: "teal", borderRadius: 50}}/>
                                            <View>
                                                <Text variant="bodyLarge" style={styles.linkListText}>From {item.request[0].sender.name} To {item.request[0].recipient.name} {item.customerConfirm ? <Entypo name="check" size={23}/> : <Entypo name="cog" size={19}/>}</Text>
                                                <Text variant="bodySmall">{moment(item.dateCreated).calendar()} ({moment(item.dateCreated).fromNow()}) </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </Card>

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
        backgroundColor: "white",
        alignItems: "center",
        // paddingTop: 30
    },
    showCont: {
        flex: 1,
        alignItems: "center"
    },
    header: {
        // textAlign: "center",
        fontWeight: "bold",
        color: "teal",
    },
    modalStyles: {
        backgroundColor: "white", 
        height: 400, 
        width: "70%", 
        marginLeft: "15%", 
        justifyContent: "flex-start"
    },
    brandLogo: {
        height: 100,
        width: 100,
        // marginTop: -90,
        // marginBottom: 30,
        borderRadius: 280/2,
        borderColor: "teal",
        borderWidth: 3,
        alignSelf: "center"
    },
    mrButton: {
        // width: 150,
        // paddingVertical: 0,
        // paddingHorizontal: 0,
        // position: "absolute",
        // top: 140,
        borderRadius: 5,
        marginVertical: 40
    },
    navButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        position: "absolute",
        bottom: 19,
        // borderWidth: 3,
        // borderColor: "teal",
        width: "100%",
    },
    mfinal: {
        borderRadius: 3,
        marginTop: 13,
        width: "70%",
        marginRight: "auto",
        marginLeft: "auto",
    },
    recvLocation: {
        borderRadius: 3,
        marginTop: 13,
        width: "70%",
        marginRight: "auto",
        marginLeft: "auto",
    },
    transModal: {
        position: "absolute",
        top: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        zIndex: 30,
        // borderColor: "blue",
        // borderWidth: 3
    },
    requestStyle: {
        // flexDirection: "row"
    },
    // map: {
    //     width: Dimensions.get("window").width,
    //     height: Dimensions.get("window").height
    // },
    confirmButton: {
        width: "40%",
        borderRadus: 90,
        marginRight: "auto",
        marginLeft: "auto"
    },
    linkStyle: {
        textAlign: "center", 
        borderColor: "white", 
        borderWidth: 1, 
        marginBottom:3, 
        borderRadius: 15,
        paddingVertical: 6,
        backgroundColor: "white",
        // shadowColor: "black",
        // shadowOffset: {width: 5, height: 15},
        // elevation: 3,
        // shadowOpacity: 3,
        // shadowRadius: 4
    },
    linkView: {
        marginHorizontal: 30,
        // borderColor: "black",
        // borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "white",
        shadowColor: "black",
        shadowOffset: {width: 5, height: 3},
        shadowOpacity: 1,
        shadowRadius: 5,
        paddingHorizontal: 8,
        paddingVertical: 5,
    },
    linkListStyle: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center", 
        fontSize: 19, 
        width: "70%", 
        marginLeft: "auto", 
        marginRight: "auto", 
        borderColor: "teal", 
        borderWidth: 4,
        borderColor: "teal",
        borderRadius: 15,
        backgroundColor: "black",
        paddingVertical: 3
    },
    cardStyle: {
        padding: 3, 
        margin: 10, 
        elevation: 7, 
        // borderColor: "teal",
        // borderWidth: 3,
        // backgroundColor: "teal", 
        cornerRadius: 30,
        // width: "100%",
        // marginLeft: "auto",
        // marginRight: "auto",
    },
    linkListText: {
        color: "black",
        textAlign: "center",
        fontWeight: "bold"
    },
    btnStyle: {
        
    },
    dropdownButtonStyle: {
        width: 200,
        height: 50,
        backgroundColor: "#e9ecef",
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: "500",
        color: "#151E26",
        
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
        color: "teal",
        borderColor: "red",
        borderWidth: 2
    },
    dropdownMenuStyle: {
        backgroundColor: "#e9ecef",
        borderColor: "blue",
        borderWidth: 3,
        borderRadius: 8,
        width: "50%",
        // marginLeft: "auto",
        marginRight: 99
    },
    dropdownItemStyle: {
        width: "100%",
        flexDirection: "row",
        paddingHorizontal: 12,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 8
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18, 
        fontWeight: "500",
        color: "#151e26"
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8
    }
})
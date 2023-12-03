import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode'
import { PaperProvider, BottomNavigation, Text } from 'react-native-paper'
import RidersDashHome from './ridersTabScreens/ridersDashHome'
import RidersDashTrans from './ridersTabScreens/ridersDashTrans'
import RidersDashProfile from './ridersTabScreens/ridersDashProfile'


export default function RidersDashboard (){
    const [ user, setUser ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ index, setIndex ] = useState(0)
    const [ routes, setRoutes ] = useState([
        {key: "home", title: "Home", focusedIcon: "home"},
        {key: "transaction", title: "Transactions", focusedIcon: "history"},
        {key: "profile", title: "Profile", focusedIcon: "account"},
    ])

    useEffect(() => {
        const fetchData = async () => {
            const token = await AsyncStorage.getItem("userToken")
            try{
                const decData = jwtDecode(token)
                await fetch("http://192.168.43.207:3000/users/" + decData.id)
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
                console.log("Something Went Wrong")
            }
        }
        fetchData()
    }, [])

    const renderScene = BottomNavigation.SceneMap({
        home: (props) => <RidersDashHome {...props} user={user} />,
        profile: (props) => <RidersDashProfile {...props} user={user} />,
        transaction: (props) => <RidersDashTrans {...props} user={user} />,
    })

    return (
        <PaperProvider>
            {loading ? (
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <Text variant="displayMedium">Loading...</Text>
                </View>
            ) : (
                <BottomNavigation 
                    navigationState={{index, routes}}
                    onIndexChange={setIndex}
                    renderScene={renderScene}
                />
            )}
        </PaperProvider>
    )
}
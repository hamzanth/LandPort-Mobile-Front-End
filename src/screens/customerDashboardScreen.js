import React, { useState, useEffect } from 'react'
import { StyleSheet, View} from 'react-native'
import jwtDecode from 'jwt-decode'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Provider as PaperProvider, BottomNavigation, Text} from 'react-native-paper'
import DashboardFavouritesRoute from './customerTabScreens/dashboardFavourites'
import DashboardHomeRoute from './customerTabScreens/dashboardHome'
import DashboardProfileRoute from './customerTabScreens/dashboardProfile'
import DashboardSearchRoute from './customerTabScreens/dashboardSearch'
import { ActivityIndicator } from 'react-native-paper'

export default function CustomerDashboard({route, navigation}){
    const [index, setIndex] = useState(0)
    const [decodedData, setDecodedData ]= useState(null)
    const [ user, setUser ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    // const {customer} = route.params

    useEffect(() => {
        const fetchData = async () => {
            const data = await AsyncStorage.getItem("userToken")
            // console.log(data)
            try{
                const decData = jwtDecode(data)
                await fetch("http://192.168.43.207:3000/users/" + decData.id)
                .then(resp => resp.json())
                .then(data => {
                    setUser(data.user)
                    // console.log(data.user)
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

    const [routes, setRoutes] = useState([
        {key: "home", title: "Home", focusedIcon: "home"},
        {key: "search", title: "Search", focusedIcon: "magnify"},
        {key: "favourites", title: "Favourites", focusedIcon: "heart"},
        {key: "profile", title: "Profile", focusedIcon: "account"},
    ])
    const renderScene = BottomNavigation.SceneMap({
        home: (props) => <DashboardHomeRoute {...props} usr={user} />,
        search: (props) => <DashboardSearchRoute {...props} usr={user} />,
        favourites: (props) => <DashboardFavouritesRoute {...props} usr={user} />,
        profile: (props) => <DashboardProfileRoute {...props} usr={user} />
    })
    
    return (
        <PaperProvider>
            {loading ? (
                <View style={{flex: 1, justifyContent: "center", alignItems:"center", backgroundColor: "teal"}}>
                    <ActivityIndicator size="large" color="white" animating={true} />
                </View>
            ): (
                <BottomNavigation 
                    navigationState={{index, routes}}
                    onIndexChange={setIndex}
                    renderScene={renderScene}
                />
            ) }
        </PaperProvider>
    )
}
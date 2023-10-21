import React, { useState, useEffect } from 'react'
import { StyleSheet, View} from 'react-native'
import { Text } from 'react-native-paper'
import jwtDecode from 'jwt-decode'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Provider as PaperProvider, BottomNavigation} from 'react-native-paper'
import DashboardFavouritesRoute from './dashboardFavourites'
import DashboardHomeRoute from './dashboardHome'
import DashboardProfileRoute from './dashboardProfile'
import DashboardSearchRoute from './dashboardSearch'

export default function Dashboard({route, navigation}){
    const [index, setIndex] = useState(0)
    const [decodedData, setDecodedData ]= useState(null)
    // const {customer} = route.params

    useEffect(() => {
        const fetchData = async () => {
            const data = await AsyncStorage.getItem("userToken")
            // console.log(data)
            try{
                // console.log(data)
                const decData = jwtDecode(data)
                // console.log(decData)
                setDecodedData(decData)
            }
            catch(error){
                alert(error)
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
        home: DashboardHomeRoute,
        search: DashboardSearchRoute,
        favourites: DashboardFavouritesRoute,
        profile: DashboardProfileRoute
    })
    
    return (
        <PaperProvider>
            <BottomNavigation 
                navigationState={{index, routes}}
                onIndexChange={setIndex}
                renderScene={renderScene}
            />
        </PaperProvider>
    )
}
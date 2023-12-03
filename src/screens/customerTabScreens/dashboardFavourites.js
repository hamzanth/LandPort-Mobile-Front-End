import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Text } from 'react-native-paper'
import MapView, {Marker, Callout} from 'react-native-maps'

export default function DashboardFavouritesRoute(){

    const pinCoords = {
        latitude: 37.78825,
        longitude: -122.4324,
    }

    const [ pin, setPin ] = useState(pinCoords)

    const initialRegion = {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    }
    return(
        <View style={styles.container}>
            {/* <Text>This is the Dash board Favourites tab</Text> */}
            <MapView 
                style={styles.map} 
                initialRegion={initialRegion}
                provider="google"
            >
                <Marker 
                    coordinate={pinCoords}
                    draggable={true}
                    onDragStart={(e) => console.log("Drag start " + e.nativeEvent.coordinate)}
                    onDragEnd={(e) => {
                        setPin({latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude})
                    }}
                />
            </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    map: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height
    }
})
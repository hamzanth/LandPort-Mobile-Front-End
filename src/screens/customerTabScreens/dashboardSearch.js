import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { Text, List, Md3Colors } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwtDecode from 'jwt-decode'
import { ActivityIndicator } from 'react-native-paper'

export default function DashboardSearchRoute({usr}){
    const [ user, setUser ] = useState(null)
    const [ loading, setLoading ] = useState(true)

    return(
        <View style={styles.container}>
            <FlatList 
                keyExtractor={(item) => item._id}
                data={usr.requests}
                renderItem={({item}) => (
                    <Text 
                        style={{color: "white", fontSize: 17, textAlign: "center"}}
                    >
                        {`${item.sender.name} => ${item.recipient.name} (${item.product.name})`}
                    </Text>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "teal",
        paddingTop: 30
    }
})
import React, { useState, useEffect } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import { Text } from 'react-native-paper'


export default function RidersDashHome({user}){

    const [ loading, setLoading ] = useState(true)
    const [ recTrans, setRecTrans ] = useState([])

    useEffect(() => {
    console.log(user)
    }, [])
    
    return (
        <View style={styles.container}>
            <Text variant="titleLarge" style={{textAlign: "center", color: "white", marginVertical: 19}}>Welcome {user.name}</Text>
            {user.transactions.length === 0 ? (
                <View>
                    <Text style={{textAlign: "center", color: "white"}}>There are no transactions currently</Text>
                </View>
            ) : (
                <FlatList 
                    keyExtractor={(item) => item._id}
                    data={user.transactions}
                    renderItem={({item}) => (
                        <View>
                            <Text variant="bodyLarge" style={{textAlign: "center", color: "white"}}>{item.refNumber}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'teal'
    }
})
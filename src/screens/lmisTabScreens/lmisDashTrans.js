import React, { useState, useEffect } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import { Text } from 'react-native-paper'

export default function LmisDashTrans({user}){

    const [ trans, setTrans ] = useState([])
    const [ loading, setLoading ] = useState(false)

    useEffect(() => {
        const fecthData = async () => {
            await fetch("http://192.168.43.207:3000/transactions/get-transactions")
            .then(resp => resp.json())
            .then(data => {
                console.log(data.message)
                setTrans(trans)
                setLoading(false)
            })
            .catch(error => console.log(error))
        }
        
    }, [])
    
    return (
        <View style={[styles.container, {justifyContent: loading ? "center" : "flex-start"}]}>
            {loading ? (
                <View>
                    <Text variant="headlineMedium" style={{textAlign: "center"}}>Loading...</Text>
                </View>
            )
             : (
                <View style={{flex: 1, textAlign: "center"}}>
                    <Text variant="headlineMedium" style={{textAlign: "center", marginBottom: 19}}>History of Transactions</Text>
                    <FlatList 
                        keyExtractor={(item) => item._id}
                        data={user.transactions}
                        renderItem={({ item }) => (
                            <View>
                                <Text variant="bodyLarge" style={{textAlign: "center"}}>{item.refNumber}</Text>
                            </View>
                        )}
                    />
                </View>
             )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})
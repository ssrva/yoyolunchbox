import * as React from 'react';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { COLORS } from "../../commonUtils"
import firebase from "firebase/app"
import OrderListItem from './components/OrderListItem';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    display: "flex",
  },
  title: {
    margin: 10,
    fontWeight: "600",
    fontSize: 18,
    backgroundColor: "white",
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.GRAY90,
  }
})

const Orders = () => {
  const user = firebase.auth().currentUser
  const [loading, setLoading] = useState<boolean>(false)
  const [orders, setOrders] = useState<Array<Object>>([])

  const fetchOrders = async () => {
    setLoading(true)
    const ordersCollection = firebase.firestore().collection("orders")
    const query = ordersCollection
      .where("uid", "==", user?.uid)
      .orderBy("date", "desc")
      .limit(20)
    query.get().then((documents) => {
      const result = []
      documents.forEach(document => {
        result.push(document.data())
      })
      setOrders(result)
    })
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders</Text>
      <FlatList
        style={{flex: 1}}
        data={orders}
        onRefresh={fetchOrders}
        refreshing={loading}
        renderItem={({item}) => {
          return (
            <OrderListItem disabled {...item} />
          )
        }}
      />
    </View>
  )
}

export default Orders
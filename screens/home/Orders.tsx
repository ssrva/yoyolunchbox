import * as React from 'react';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { COLORS } from "../../commonUtils"
import firebase from "firebase/app"
import OrderListItem from './components/OrderListItem';
import * as api from "../../api"
import { useSelector } from 'react-redux';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    display: "flex",
  },
  title: {
    fontWeight: "600",
    fontSize: 18,
    backgroundColor: "white",
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.GRAY90,
  }
})

const Orders = () => {
  const username = useSelector(store => store.user.username)
  const [loading, setLoading] = useState<boolean>(false)
  const [orders, setOrders] = useState<Array<Object>>([])
  const [balance, setBalance] = useState<Number>(0)

  const fetchOrders = async () => {
    setLoading(true)
    const userOrders = await api.getUserOrders(username, 0)
    setOrders(userOrders)
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
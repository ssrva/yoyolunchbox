import _ from "lodash"
import * as React from 'react';
import { useEffect, useState } from 'react';
import { FlatList, SectionList, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { COLORS } from "../../commonUtils"
import OrderListItem from './components/OrderListItem';
import * as api from "../../api"
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
    flex: 1,
    display: "flex",
  },
  title: {
    padding: 10,
    marginBottom: 10,
    marginTop: 0,
    backgroundColor: COLORS.GRAY95,
    borderRadius: 5,
    textTransform: "uppercase",
    overflow: "hidden",
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  icon: {
    marginRight: 10,
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 16,
  }
})

const Orders = (props) => {
  const status = props.route.params.status || "upcoming"
  const username = useSelector(store => store.user.username)
  const [loading, setLoading] = useState<boolean>(false)
  const [orders, setOrders] = useState<Array<Object>>([])

  const fetchOrders = async () => {
    setLoading(true)
    const userOrders = await api.getUserOrders(status, username, 0)
    setOrders(userOrders)
    setLoading(false)
  }

  useFocusEffect(
    React.useCallback(() => {
      if(_.isEmpty(orders)) {
        fetchOrders()
      }  
      return () => {}
    }, [status])
  )

  return (
    <View style={styles.container}>
      <FlatList
        onRefresh={fetchOrders}
        refreshing={loading}
        data={orders}
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
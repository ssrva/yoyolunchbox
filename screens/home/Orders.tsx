import _ from "lodash"
import moment from "moment"
import * as React from 'react';
import { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { View } from '../../components/Themed';
import { COLORS } from "common/utils"
import OrderListItem from './components/OrderListItem';
import * as api from "../../api"
import { useSelector } from 'react-redux';
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

const UPCOMING_ORDERS = "upcoming"
const CANCELLED_ORDERS = "cancelled"

const Orders = (props) => {
  const status = props.route.params.status || UPCOMING_ORDERS
  const username = useSelector(store => store.user.username)
  const [loading, setLoading] = useState<boolean>(false)
  const [orders, setOrders] = useState<Array<Object>>([])
  const today = moment().utcOffset("530").format("YYYY-MM-DD");

  const fetchOrders = async () => {
    setLoading(true)
    let userOrders = await api.getUserOrders(status, username, 0)
    if (status == UPCOMING_ORDERS) {
      userOrders = userOrders.filter(order => {
        return order.date >= today
      })
    }
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

  const isOrderCancellable = () => {
    return status == UPCOMING_ORDERS
  }

  const refreshDataAfterCancellation = () => {
    if (isOrderCancellable()) {
      fetchOrders()
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        onRefresh={fetchOrders}
        refreshing={loading}
        data={orders}
        renderItem={({item}) => {
          return (
            <OrderListItem
              cancellable={isOrderCancellable()}
              onChange={refreshDataAfterCancellation}
              disabled {...item} />
          )
        }}
      />
    </View>
  )
}

export default Orders
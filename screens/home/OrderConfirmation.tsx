import * as React from 'react';
import _ from "lodash"
import moment from "moment"
import { ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux';
import { refreshBalance } from 'store/actions';
import { Text, View } from '../../components/Themed'
import commonStyles from "./styles"
import OrderListItem from './components/OrderListItem'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { COLORS, notifyMessage } from "../../commonUtils"
import { Button, Input } from "@ui-kitten/components"
import * as api from "../../api"
import { useSelector } from 'react-redux'
import { useState } from 'react'
import Constants from 'yoyoconstants/Constants';
import * as Sentry from "@sentry/browser"

type TOrderConfirmationProps = {
  route: Object,
  navigation: any
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    display: "flex",
    paddingTop: 0,
    padding: 15,
  },
  title: {
    color: "black",
    marginBottom: 0,
    fontWeight: "600",
    fontSize: 18,
    backgroundColor: "white",
  },
  billDetailsContainer: {
    backgroundColor: "white",
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.GRAY90,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 5,
    padding: 15
  },
  billTitle: {
    color: "black",
    fontSize: 15,
    textTransform: "uppercase",
    paddingBottom: 5,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: "#D1D1D1"
  },
  tableContainer: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column"
  },
  tableRow: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 5,
    paddingBottom: 5,
  },
  lastRow: {
    marginTop: 5,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#D1D1D1"
  },
  warningText: {
    color: "red",
    fontStyle: "italic",
    marginBottom: 10
  }
})

const OrderConfirmation = (props: TOrderConfirmationProps) => {
  const { route, navigation } = props
  const [loading, setLoading] = useState<boolean>(false)
  const [remarks, setRemarks] = useState<string>("")
  const username = useSelector(store => store.user.username)
  const [orders, setOrders] = useState<Array<Object>>(route?.params?.orders || [])
  const balance = useSelector(store => store.balance)
  const itemTotalPrice = orders.reduce((acc, order) => {
    return acc + (order.price * order.quantity)
  }, 0)
  const hasSufficientBalance = itemTotalPrice <= balance
  const dispatch = useDispatch();

  const confirmOrder = async () => {
    const apiInput = orders.map(order => {
      return {
        menu_id: order.id,
        quantity: order.quantity,
        amount: order.quantity * order.price,
        remarks: remarks,
      }
    })

    try {
      const currentDate = await api.getCurrentTime();
      if (currentDate) {
        const time = moment(currentDate.datetime);
        const date = time.format("YYYY-MM-DD");
        const hour = parseInt(time.format("HH"));
        let invalidOrder = false;
        orders.forEach(order => {
          if (order.date == date) {
            if ((order.type == Constants.dinner && hour > Constants.dinnerCutoffHour)
                || (order.type == Constants.lunch && hour > Constants.lunchCutoffHour)
                || (order.type == Constants.breakfast && hour > Constants.breakfastCutoffHour)) {
                invalidOrder = true;
            }
          }
        });
        if (invalidOrder) {
          const message = `Orders should be placed before 6AM for Brunch, 9AM for Lunch and 4PM for Dinner`;
          notifyMessage(message)
          return;
        }
      }
    } catch (e) {
      Sentry.captureException(e)
    }

    const charges = {
      // delivery: 40,
      // packing: 6,
    }

    setLoading(true)
    try {
      await api.placeOrder(username, charges, apiInput)
      notifyMessage("Order placed successfully")
      dispatch(refreshBalance())
      navigation.navigate("Home")
    } catch (e) {
      notifyMessage("Error placing order")
    } finally {
      setLoading(false)
    }
  }

  const onChange = (order) => {
    if (order.quantity == 0) {
      const newOrders = orders.filter(o => o.id != order.id)
      setOrders(newOrders);
    } else {
      const newOrders = orders.map(o => {
        if (o.id == order.id) {
          o.quantity = order.quantity;
        }
        return o;
      })
      setOrders(newOrders);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={{ backgroundColor: "white" }}>
        <Text style={styles.title}>Order Summary</Text>
        <FlatList
          style={{flex: 1}}
          data={orders}
          renderItem={({item}) => {
            return (
              <OrderListItem onChange={onChange} {...item} />
            )
          }}
        />
        <Input
          value={remarks}
          multiline
          placeholder="Any instructions?"
          numberOfLines={4}
          onChangeText={setRemarks} />
        <View style={styles.billDetailsContainer}>
          <Text style={styles.billTitle}>Bill Details</Text>
          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <Text style={{ fontWeight: "bold", color: "black" }}>Item Total</Text>
              <Text style={{ color: "black" }}>{'\u20B9'}{itemTotalPrice}</Text>
            </View>
            {/* <View style={styles.tableRow}>
              <Text style={{ fontWeight: "bold" }}>Packing charges</Text>
              <Text>{'\u20B9'}6</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={{ fontWeight: "bold" }}>Delivery charges</Text>
              <Text>{'\u20B9'}40</Text>
            </View> */}
            <View style={{...styles.tableRow, ...styles.lastRow}}>
              <Text style={{ fontWeight: "bold", color: "black" }}>Total</Text>
              <Text style={{ color: "black" }}>{'\u20B9'}{itemTotalPrice}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={commonStyles.footer}>
        {!hasSufficientBalance && (
          <View style={{ backgroundColor: "white" }}>
            <Text style={styles.warningText}>
              Your balance is insufficient to place this order. Please recharge your wallet to continue ordering.
            </Text>
          </View>
        )}
        <TouchableOpacity
          disabled={loading || !hasSufficientBalance}
          style={commonStyles.mainButton}
          onPress={confirmOrder}>
          {loading && (<ActivityIndicator style={{ marginRight: 10 }} color="white" />)}
          <Text style={{ color: "white" }}>Confirm Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default OrderConfirmation

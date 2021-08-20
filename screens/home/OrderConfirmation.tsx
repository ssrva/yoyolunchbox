import * as React from 'react';
import _ from "lodash"
import { ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native'
import { Text, View } from '../../components/Themed'
import commonStyles from "./styles"
import OrderListItem from './components/OrderListItem'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { COLORS, notifyMessage } from "../../commonUtils"
import { Button, Input } from "@ui-kitten/components"
import * as api from "../../api"
import { useSelector } from 'react-redux'
import { useState } from 'react'

type TOrderConfirmationProps = {
  route: Object,
  navigation: any
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    paddingTop: 0,
    padding: 15,
  },
  title: {
    marginBottom: 0,
    fontWeight: "600",
    fontSize: 18,
    backgroundColor: "white",
  },
  billDetailsContainer: {
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
    fontSize: 15,
    textTransform: "uppercase",
    paddingBottom: 5,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: "#D1D1D1"
  },
  tableContainer: {
    display: "flex",
    flexDirection: "column"
  },
  tableRow: {
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
  }
})

const OrderConfirmation = (props: TOrderConfirmationProps) => {
  const { route, navigation } = props
  const [loading, setLoading] = useState<boolean>(false)
  const [remarks, setRemarks] = useState<string>("")
  const username = useSelector(store => store.user.username)
  const orders = route?.params?.orders || []
  const itemTotalPrice = orders.reduce((acc, order) => {
    return acc + (order.price * order.quantity)
  }, 0)

  const confirmOrder = async () => {
    const apiInput = orders.map(order => {
      return {
        menu_id: order.id,
        quantity: order.quantity,
        amount: order.quantity * order.price,
        remarks: remarks,
      }
    })

    const charges = {
      // delivery: 40,
      // packing: 6,
    }

    setLoading(true)
    try {
      await api.placeOrder(username, charges, apiInput)
      notifyMessage("Order placed successfully")
      navigation.navigate("Home")
    } catch (e) {
      notifyMessage("Error placing order")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Order Summary</Text>
        <FlatList
          style={{flex: 1}}
          data={orders}
          renderItem={({item}) => {
            return (
              <OrderListItem disabled {...item} />
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
              <Text style={{ fontWeight: "bold" }}>Item Total</Text>
              <Text>{'\u20B9'}{itemTotalPrice}</Text>
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
              <Text style={{ fontWeight: "bold" }}>Total</Text>
              <Text>{'\u20B9'}{itemTotalPrice}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={commonStyles.footer}>
        <TouchableOpacity
          disabled={loading}
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

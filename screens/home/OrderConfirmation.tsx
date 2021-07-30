import * as React from 'react';
import _ from "lodash"
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import commonStyles from "./styles"
import OrderListItem from './components/OrderListItem';
import { FlatList } from 'react-native-gesture-handler';
import { COLORS, notifyMessage } from "../../commonUtils"
import { Button } from "@ui-kitten/components"
import * as api from "../../api"
import { useSelector } from 'react-redux';

type TOrderConfirmationProps = {
  route: Object,
  navigation: any
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
  },
  title: {
    margin: 20,
    marginBottom: 0,
    fontWeight: "600",
    fontSize: 18,
    backgroundColor: "white",
    borderBottomWidth: 2,
    borderBottomColor: COLORS.GRAY90,
  }
})

const OrderConfirmation = (props: TOrderConfirmationProps) => {
  const { route, navigation } = props
  const username = useSelector(store => store.user.username)
  const orders = route?.params?.orders || []

  const confirmOrder = async () => {
    const apiInput = orders.map(order => {
      return {
        username: username,
        menu_id: order.id,
        quantity: order.quantity,
        amount: order.quantity * order.price,
      }
    })

    try {
      await api.placeOrder(apiInput)
      notifyMessage("Order placed successfully")
      navigation.navigate("Home")
    } catch (e) {
      notifyMessage("Error placing order")
    }
  }

  return (
    <View style={styles.container}>
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
      <View style={commonStyles.footer}>
        <Button style={commonStyles.mainButton} onPress={confirmOrder}>
          Confirm Order
        </Button>
      </View>
    </View>
  )
}

export default OrderConfirmation

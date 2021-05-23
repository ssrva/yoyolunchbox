import * as React from 'react';
import _ from "lodash"
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import moment from "moment"
import commonStyles from "./styles"
import OrderListItem from './components/OrderListItem';
import { FlatList } from 'react-native-gesture-handler';
import { COLORS } from "../../commonUtils"
import firebase from "firebase/app"
import { Button } from "@ui-kitten/components"

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
  const orders = route?.params?.orders || []
  const date = route?.params?.date || ""
  const user = firebase.auth().currentUser

  const confirmOrder = () => {
    const batch = firebase.firestore().batch()
    orders.forEach((order) => {
      const data = {
        ...order,
        uid: user?.uid,
        date: date,
        createdAt: moment().format(),
      }
      const collection = firebase.firestore().collection("orders").doc()
      batch.set(collection, data)
    })
    batch.commit().then(() => {
      navigation.navigate("Home")
      console.log("finished update")
    })
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
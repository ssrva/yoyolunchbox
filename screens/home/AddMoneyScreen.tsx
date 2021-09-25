import _ from "lodash"
import moment from "moment"
import * as React from 'react';
import { useEffect, useState } from 'react';
import { TouchableWithoutFeedback, View, Text, StyleSheet, Keyboard, ActivityIndicator } from 'react-native';
import * as api from "../../api"
import { useSelector } from 'react-redux';
import { Button, Input } from "@ui-kitten/components";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from '@expo/vector-icons';
import { secondaryColor } from "../../commonUtils";
import RNPgReactNativeSdk from "react-native-pg-react-native-sdk/bridge";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  offer: {
    backgroundColor: "#D4EDDA",
    borderWidth: 1,
    borderColor: "#C3E6CB",
    marginBottom: 20,
    padding: 10,
    display: "flex",
    flexDirection: "row"
  },
  offerTitle: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 16
  },
  button: {
    alignItems: "center",
    backgroundColor: secondaryColor,
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  innerContainer: {
    display: "flex",
    flex: 1,
  },
  label: {
    marginTop: 10,
    fontStyle: "italic"
  }
})

const AddMoneyComponent = (props) => {
  const user = useSelector(store => store.user)
  const [amount, setAmount] = useState<string>("0")
  const [loading, setLoading] = useState<boolean>(false)


  const constructPaymentRequest = (orderId, amount, token) => {
    const checkout = new Map<string,string>()
    checkout.set('orderId', orderId)
    checkout.set('orderAmount', amount)
    checkout.set('appId', "924989d1ebeeaf3afe3c26a9c89429")
    checkout.set('tokenData', token)
    checkout.set('orderCurrency', "24839868117154ae939ef625065eb8b1f339984c")
    checkout.set('orderNote', 'Test Note')
    checkout.set('customerName', 'Cashfree User')
    checkout.set('customerPhone', '9999999999')
    checkout.set('customerEmail', 'cashfree@cashfree.com')
    checkout.set('hideOrderId', 'true')
    checkout.set('color1', '#6002EE')
    checkout.set('color2', '#ffff1f')
    return checkout
  }

  const responseHandler = (result) => {
    try {
      console.log(result)
    } catch (error) {
      console.log(error.message)
    }
  }

  const makePayment = async () => {
    setLoading(true)
    try {
      const id = `${user.username}_${new Date().getTime()}`
      const tokenResponse = await api.getCashfreeOrderToken(id, amount)
      const token = tokenResponse.cfToken
      const paymentRequest = constructPaymentRequest(id, amount, token)
      RNPgReactNativeSdk.startPaymentWEB(paymentRequest, 'TEST', (response) => {
        console.log(response)
      });
    } catch(e) {
      console.log(e.message)
    }
    setLoading(false)
  }

  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.offer}>
            <Ionicons
              size={35}
              style={{ marginRight: 15 }}
              name="pricetags-outline"
              color={"black"} />
            <View style={{ maxWidth: "95%" }}>
              <Text style={styles.offerTitle}>Limited Time Offer!</Text>
              <Text>
                Recharge over Rs. 3000 to get a 10% cashback added to your YOYO wallet
              </Text>
            </View>
          </View>
          <View style={styles.innerContainer}>
            <View style={{ flex: 1 }}>
              <Input
                label="Amount to add"
                value={amount}
                keyboardType="numeric"
                onChangeText={setAmount}
                placeholder="Amount to add" />
              <Text style={styles.label}>
                Payments powered by Cashfree.
              </Text>
            </View>
            <TouchableOpacity
              onPress={makePayment}
              style={styles.button}>
              {loading && <ActivityIndicator style={{ marginRight: 10 }} />}
              <Text style={{ color: "white" }}>Add Money</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

export default AddMoneyComponent
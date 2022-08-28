import _ from "lodash"
import moment from "moment"
import * as React from 'react';
import { useEffect, useState } from 'react';
import { TouchableWithoutFeedback, View, Text, StyleSheet, Keyboard, ActivityIndicator } from 'react-native';
import * as api from "../../api"
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input } from "@ui-kitten/components";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from '@expo/vector-icons';
import { notifyMessage, secondaryColor } from "common/utils";
import RNPgReactNativeSdk from "react-native-pg-react-native-sdk/bridge";
import Spinner from "./components/Spinner"
import { setBalance } from "../../store/actions"
import * as Sentry from "@sentry/browser"
import * as Amplitude from "expo-analytics-amplitude"
import getEnvironmentVariables from "common/environments";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  messageBoxGreen: {
    backgroundColor: "#D4EDDA",
    borderWidth: 1,
    borderColor: "#C3E6CB",
    marginBottom: 20,
    padding: 10,
    display: "flex",
    flexDirection: "column"
  },
  messageBoxRed: {
    backgroundColor: "#F8D7DA",
    borderWidth: 1,
    borderColor: "#F5C6CB",
    marginBottom: 20,
    padding: 10,
    display: "flex",
    flexDirection: "row"
  },
  offerTitle: {
    fontWeight: "bold",
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
  },
  presetContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  presetButton: {
    borderColor: "#007bff",
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    display: "flex",
    alignItems: "center"
  },
  presetText: {
    fontWeight: "bold",
    color: "#007bff"
  }
})

type CashfreeResponse = {
  paymentMode: string,
  orderId: string,
  txTime: string,
  referenceId: string,
  txMsg: string,
  signature: string,
  orderAmount: string,
  txStatus: string
}

const AddMoneyComponent = (props) => {
  const { navigation } = props
  const dispatch = useDispatch()
  const user = useSelector(store => store.user)
  const [amount, setAmount] = useState<string>("0")
  const [loading, setLoading] = useState<boolean>(false)
  const [responseMessage, setResponseMessage] = useState<string>()
  const [responseMessageStyle, setResponseMessageStyle] = useState<string>("messageBoxGreen")

  const cashFreeAppId = getEnvironmentVariables().cashFreeAppId;

  const resetState = () => {
    setAmount("0")
    setResponseMessage(undefined)
  }

  const setAmountWithTracking = async (amount: string) => {
    setAmount(amount)
    Amplitude.logEventWithPropertiesAsync("ADD_MONEY_QUICK_PRESET", {
      amount: amount
    })
  }

  const fetchNewBalance = async () => {
    const balance = await api.getUserWalletBalance(user.username)
    dispatch(setBalance({ balance: balance?.balance || 0 }))
    setBalance(balance?.balance)
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      resetState()
    })
    return unsubscribe;
  }, [navigation])

  const constructPaymentRequest = (orderId, amount, token) => {
    const checkout = new Map<string,string>()
    checkout.set('orderId', orderId)
    checkout.set('orderAmount', amount)
    checkout.set('appId', cashFreeAppId)
    checkout.set('tokenData', token)
    checkout.set('orderCurrency', "INR")
    checkout.set('orderNote', `Wallet update for ${user.username} - ${user.attributes?.name}`)
    checkout.set('customerName', user.attributes?.name || "YOYO User")
    checkout.set('customerPhone', user.username)
    checkout.set('customerEmail', "lunchboxyoyo@gmail.com")
    checkout.set('color1', '#6002EE')
    checkout.set('color2', '#ffff1f')
    return checkout
  }

  const responseHandler = async (result: CashfreeResponse) => {
    try {
      if(result.txStatus === "SUCCESS") {
        Amplitude.logEventWithPropertiesAsync("ADD_MONEY_PROCESSOR_CALLBACK_RECEIVED", { amount: amount })
        await api.updateUserWalletBalance(
          user.username,
          amount,
          result
        )
        Amplitude.logEventWithPropertiesAsync("ADD_MONEY_SUCCESS", { amount: amount })
        setResponseMessageStyle("messageBoxGreen")
        setResponseMessage("Trasaction successful!")
      } else {
        setResponseMessageStyle("messageBoxRed")
        Amplitude.logEventWithPropertiesAsync("ADD_MONEY_PROCESSOR_FAILURE", { amount: amount })
        setResponseMessage("Transaction failed. Please contact YOYO Lunchbox team if you think this is a mistake.")
      }
      fetchNewBalance()
    } catch (error) {
      Sentry.captureException(error)
      Amplitude.logEventWithPropertiesAsync("ADD_MONEY_FAILURE", { amount: amount })
      setResponseMessageStyle("messageBoxRed")
      setResponseMessage("Transaction failed. Please contact YOYO Lunchbox team if you think this is a mistake.")
    }
  }

  const makePayment = async () => {
    setLoading(true)
    setResponseMessage(undefined)
    if(_.isNil(amount) || amount === "0") {
      notifyMessage("Amount cannot be 0")
    } else {
      try {
        const id = `${user.username}_${new Date().getTime()}`
        const cashFreeEnv = getEnvironmentVariables().cashFreeEnv
        const tokenResponse = await api.getCashfreeOrderToken(id, amount, cashFreeEnv)
        console.log(tokenResponse);
        const token = tokenResponse.cfToken
        const paymentRequest = constructPaymentRequest(id, amount, token)
        Amplitude.logEventWithPropertiesAsync("ADD_MONEY_TRIGGERED", { amount: amount })
        RNPgReactNativeSdk.startPaymentWEB(paymentRequest, cashFreeEnv, async (result) => {
          await responseHandler(JSON.parse(result))
        });
      } catch(e) {
        console.log(e)
        console.log(e.message)
      }
    }
    setLoading(false)
  }

  return (
    <View style={{ flex: 1 }}>
      <Spinner visible={loading} message="Transaction in progress"/>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* <View style={styles.messageBoxGreen}>
            <View style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center" }}>
              <Ionicons
                size={30}
                style={{ marginRight: 15 }}
                name="pricetags-outline"
                color={"black"} />
              <Text style={styles.offerTitle}>Limited Time Offer!</Text>
            </View>
            <Text>
              Recharge over Rs. 3000 to get a 5% cashback added to your YOYO wallet
            </Text>
          </View> */}
          <View style={styles.innerContainer}>
            <View style={{ flex: 1 }}>
              <Input
                label="Amount to add"
                value={amount}
                keyboardType="numeric"
                onChangeText={setAmount}
                placeholder="Amount to add" />
              <View style={styles.presetContainer}>
                <TouchableOpacity
                  onPress={() => setAmountWithTracking("500")}
                  style={styles.presetButton}>
                  <Text style={styles.presetText}>+ 500</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setAmountWithTracking("1000")}
                  style={styles.presetButton}>
                  <Text style={styles.presetText}>+ 1000</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setAmountWithTracking("3000")}
                  style={styles.presetButton}>
                  <Text style={styles.presetText}>+ 3000</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.label}>
                Payments powered by Cashfree.
              </Text>
            </View>
            {!_.isNil(responseMessage) && (
              <View style={styles[responseMessageStyle]}>
                <Text>{responseMessage}</Text>
              </View>
            )}
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
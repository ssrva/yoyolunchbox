import _ from "lodash"
import * as React from 'react'
import axios from "axios"
import {
  ActivityIndicator,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Text, View } from '../../components/Themed'
import { notifyMessage } from "common/utils"
import { useDispatch, useSelector } from 'react-redux'
import { Input } from '@ui-kitten/components';
import { useState } from 'react'
import styles from "./styles"
import * as Sentry from "@sentry/browser"
import * as Amplitude from 'expo-analytics-amplitude';
import * as api from "../../api"
import { setUserWithTracking } from '../../store/actions'


export default function AddAddress(props) {
  const { navigation } = props
  const dispatch = useDispatch()
  const [loading, setLoading] = useState<boolean>(false)
  const [address, setAddress] = useState<string>("")
  const [pincode, setPincode] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const user = useSelector(store => store.user)

  const saveAddress = async () => {
    setErrorMessage("")
    if (address.length == 0 || pincode.length == 0) {
      setErrorMessage("Both address and pincode are mandatory.")
      return null;
    }
    setLoading(true)
    const username = user["username"]
    const addAddressInput = {
      username: username,
      address: address,
      pincode: pincode,
      label: "Home"
    }
    try {
      await api.addAddress(addAddressInput);
      const addresses = await api.getAddress(username)
      dispatch(setUserWithTracking({
        user: {
          ...user,
          addresses: addresses || []
        }
      }))
    } catch (e) {
      console.log(e)
      Sentry.captureException(e)
      notifyMessage("Failed to add address, please try again later.")
    }
    setLoading(false)
  }


  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView style={styles.background}>
          <View style={styles.topBackground} />
          <Image
            style={styles.cornerBackground}
            source={require("../../static/images/circles-bg.png")} />
          <View style={styles.logoArea}>
            <Image
              style={styles.logo}
              source={require("../../static/images/logo.png")} />
            <Text style={styles.tagline}>
              Good Food, Every Day!
            </Text>
          </View>
          <View style={styles.formArea}>
            <View style={{ backgroundColor: "transparent" }}>
              <View style={{ backgroundColor: "transparent" }}>
                <Text style={{ paddingBottom: 20, textAlign: "center", fontSize: 16, fontWeight: 'bold' }}>
                  Let us know your address so that we can deliver your yummy food!
                </Text>
                <Input
                  multiline
                  textStyle={{ height: 100, paddingVertical: 10 }}
                  style={{ paddingBottom: 10 }}
                  value={address}
                  textAlignVertical="top"
                  onChangeText={setAddress}
                  placeholder="Address" />
                <Input
                  maxLength={20}
                  textStyle={{ paddingVertical: 2 }}
                  style={{ paddingBottom: 10 }}
                  onChangeText={setPincode}
                  value={pincode}
                  placeholder="Pin Code" />
                {errorMessage.length > 0 && (
                  <Text style={{ color: "red" }}>
                    {errorMessage}
                  </Text>
                )}
                <TouchableOpacity
                  disabled={loading}
                  style={styles.button}
                  onPress={saveAddress}>
                  {loading && <ActivityIndicator style={{ marginRight: 10 }} color="white" />}
                  <Text style={{ color: "white" }}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
}


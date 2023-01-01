import _ from "lodash"
import * as React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Text, View } from '../../components/Themed'
import { StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, TouchableNativeFeedback } from 'react-native';
import { Input, Button } from '@ui-kitten/components';
import * as api from "../../api"
import * as Sentry from "@sentry/browser"
import { notifyMessage } from "common/utils";

const styles = StyleSheet.create({
  main: {
    backgroundColor: "white",
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },
  map: {
    width: "100%",
    borderColor: "#D1D1D1",
    borderWidth: 1,
    flex: 1
  },
  marker: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  locateMe: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "transparent",
    borderRadius: 5,
    overflow: "hidden"
  },
  locateMeButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d1d1",
    borderRadius: 5,
    padding: 10
  },
  markerData: {
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 10,
    borderRadius: 5,
    color: "white",
    fontWeight: "bold",
    overflow: "hidden"
  },
  tooltip: {
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "rgba(0,0,0,0.8)",
    backgroundColor: "transparent"
  },
  dataContainer: {
    backgroundColor: "white",
    padding: 20,
    paddingBottom: 50
  },
  title: {
    fontWeight: "600",
    color: "#696969",
    marginBottom: 10
  }
});

const AddAddress = (props) => {
  const { route, navigation } = props
  const add = route?.params?.add || false
  const id = route?.params?.id
  const initialLabel = route?.params?.initialLabel
  const initialPincode = route?.params?.initialPincode
  const initialAddress = route?.params?.initialAddress

  const [address, setAddress] = useState<string>(initialAddress)
  const [label, setLabel] = useState<string>(initialLabel)
  const [pincode, setPincode] = useState<string>(initialPincode?.toString() || "")
  const [loading, setLoading] = useState<boolean>(false)

  const username = useSelector(store => store.user.username)

  const addAddress = async (label, address) => {
    setLoading(true)
    try {
      if (add) {
        const addAddressInput = {
          username: username,
          address: address,
          pincode: pincode,
          label: label
        }
        await api.addAddress(addAddressInput)
        notifyMessage("Address Added")
        navigation.goBack()
      } else {
        const updateAddressInput = {
          id: id,
          username: username,
          address: address,
          pincode: pincode,
          label: label
        }
        console.log(updateAddressInput);
        await api.updateAddress(updateAddressInput)
        notifyMessage("Address Updated")
        navigation.goBack()
      }
    } catch (e) {
      console.log(e.message)
      Sentry.captureException(e)
      notifyMessage("Failed to add address, please try again later")
    }
    setLoading(false)
  }

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.main}>
          <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100}>
            <View style={styles.dataContainer}>
              <Text style={styles.title}>Address</Text>
              <Input
                maxLength={20}
                style={{ paddingBottom: 10 }}
                onChangeText={setLabel}
                value={label}
                placeholder="Address Label" />
              <Input
                multiline
                textStyle={{ height: 64, paddingTop: 10 }}
                style={{ paddingBottom: 10 }}
                value={address}
                onChangeText={setAddress}
                textAlignVertical="top"
                placeholder="Full address" />
              <Input
                maxLength={20}
                style={{ paddingBottom: 10 }}
                onChangeText={setPincode}
                value={pincode}
                placeholder="Pincode" />
              <Button
                disabled={loading || _.isEmpty(address) || _.isEmpty(label) || _.isEmpty(pincode)}
                onPress={() => addAddress(label, address)}>
                {add ? "Add Address" : "Update Address"}
              </Button>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default AddAddress;

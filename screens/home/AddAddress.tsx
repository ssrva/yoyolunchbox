import _ from "lodash"
import * as React from 'react'
import { useState } from 'react'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { useSelector } from 'react-redux'
import { Text, View } from '../../components/Themed'
import { StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, TouchableNativeFeedback } from 'react-native';
import { Input, Button } from '@ui-kitten/components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as api from "../../api"
import * as Sentry from "@sentry/browser"
import { notifyMessage } from "common/utils";
import Constants from 'yoyoconstants/Constants';
import * as Location from "expo-location";
import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from "react-native-gesture-handler"

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
    paddingBottom: 50,
    shadowColor: "#171717",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    borderRadius: 5
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
  const latitude = route?.params?.latitude
  const longitude = route?.params?.longitude
  const initialLabel = route?.params?.initialLabel
  const initialAddress = route?.params?.initialAddress

  const [region, setRegion] = useState<Object>({
      latitude: parseFloat(latitude) || 12.9800217,
      longitude: parseFloat(longitude) || 80.213505,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
  })
  const [address, setAddress] = useState<string>(initialAddress)
  const [label, setLabel] = useState<string>(initialLabel)
  const [loading, setLoading] = useState<boolean>(false)
  const username = useSelector(store => store.user.username)

  const addAddress = async (region, label, address) => {
    setLoading(true)
    try {
      const distanceResponse = await api.getDistance(region.latitude, region.longitude)
      const distanceInMeters = distanceResponse?.rows?.[0]?.elements?.[0]?.distance?.value
      console.log(distanceResponse)
      // if (distanceInMeters != null) {
        // if (distanceInMeters > Constants.maxDeliveryDistanceInMeters) {
          // notifyMessage("Sorry, we don't deliver to your location yet. If you think this is a mistake please contact us.")
        // } else {
          if (add) {
            const addAddressInput = {
              username: username,
              address: address,
              label: label,
              coordinates: {
                latitude: parseFloat(region.latitude),
                longitude: parseFloat(region.longitude)
              }
            }
            await api.addAddress(addAddressInput)
            notifyMessage("Address Added")
            navigation.goBack()
          } else {
            const updateAddressInput = {
              id: id,
              username: username,
              address: address,
              label: label,
              coordinates: {
                latitude: parseFloat(region.latitude),
                longitude: parseFloat(region.longitude)
              }
            }
            console.log(updateAddressInput);
            await api.updateAddress(updateAddressInput)
            notifyMessage("Address Updated")
            navigation.goBack()
          }
      //   }
      // } else {
      //   notifyMessage("Failed to add address, please try again later")
      // }
    } catch (e) {
      console.log(e.message)
      Sentry.captureException(e)
      notifyMessage("Failed to add address, please try again later")
    }
    setLoading(false)
  }

  const setMapToCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync()
    let data = {
      latitude: 13.067439,
      longitude: 80.237617
    }
    if (status !== "granted") {
      console.log("Permission not granted")
    } else {
      const location = await Location.getCurrentPositionAsync({})
      data = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }
    }
    setRegion({ ...region, ...data })
  }

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.main}>
          <View style={{ flex: 1 }}>
            <MapView
              provider={PROVIDER_GOOGLE}
              region={region}
              initialRegion={region}
              onRegionChangeComplete={setRegion}
              style={styles.map} />
            <View pointerEvents="none" style={styles.marker}>
              <Text style={styles.markerData}>Order will be delivered here</Text>
              <View style={styles.tooltip}><Text></Text></View>
            </View>
            <View style={styles.locateMe}>
              <TouchableOpacity
                style={styles.locateMeButton}
                onPress={setMapToCurrentLocation}>
                <MaterialIcons size={25} name="my-location" />
              </TouchableOpacity>
            </View>
          </View>
          
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
                textStyle={{ height: 64 }}
                style={{ paddingBottom: 10 }}
                value={address}
                onChangeText={setAddress}
                placeholder="Full address" />
              <Button
                disabled={loading || _.isEmpty(address) || _.isEmpty(label)}
                onPress={() => addAddress(region, label, address)}>
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

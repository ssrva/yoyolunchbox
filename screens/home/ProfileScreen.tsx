import * as React from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'
import { Text, View } from '../../components/Themed'
import { notifyMessage, primaryColor } from "common/utils"
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Input, RadioGroup, Radio, Button } from '@ui-kitten/components';
import commonStyles from "./styles"
import * as api from "../../api"
import moment from 'moment'
import * as Location from 'expo-location'
import { ScrollView } from 'react-native-gesture-handler'
import * as Sentry from "@sentry/browser";
import Colors from 'yoyoconstants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native';


const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    flex: 1,
    display: "flex",
  },
  label: {
    color: "black",
    marginBottom: 10,
    fontWeight: "bold"
  },
  title: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  profileMetadata: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  formElements: {
    backgroundColor: "white",
    flex: 1,
  },
  input: {
    marginBottom: 20,
  },
  header: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    marginBottom: 10,
    borderBottomWidth: 2,
    paddingBottom: 15
  },
  section: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E1E1E1",
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 10
  },
  profileMetadataText: {
    color: Colors.theme.secondary,
    fontSize: 12,
    textTransform: "uppercase"
  },
  logoutButton: {
    borderRadius: 50,
    padding: 10,
    backgroundColor: primaryColor,
  },
  mapContainer: {
    height: 300,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  map: {
    width: "100%",
    height: "100%",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 4
  },
  mealPreferenceContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  button: {
    alignSelf:"flex-start",
    marginTop: 10,
    marginBottom: 10,
  }
})

const ProfileScreen = (props) => {
  const { navigation } = props
  const [loading, setLoading] = useState<boolean>(false)
  const user = useSelector(store => store.user)
  const name = user.attributes?.name || ""
  const [addressDetails, setAddressDetails] = useState<Array<Object>>()
  const [createdOn, setCreatedOn] = useState<string>()
  const [phone, setPhone] = useState<string>()
  const [mealPreferenceIndex, setMealPreferenceIndex] = useState<number>(3)
  const [addressLoading, setAddressLoading] = useState<boolean>(false)


  const fetchAddressDetails = async () => {
    setAddressLoading(true)
    const addressDetails = await api.getAddress(user.username);
    setAddressDetails(addressDetails);
    setAddressLoading(false)
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAddressDetails()
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const fetchProfileData = async () => {
      const details = await api.getUserDetails(user.username)
      setCreatedOn(details.created_on)
      setPhone(details.phone)
      setMealPreferenceIndex(mealPreferenceToIndex(details.meal_preference))
    }
    fetchProfileData()
  }, [])

  const updateMealPreference = async () => {
    const details = {
      meal_preference: indexToMealPreference(mealPreferenceIndex)
    }
    setLoading(true)
    try {
      await api.updateUserMealPreference(user.username, details)
      notifyMessage("Updated successfully")
    } catch (e) {
      Sentry.captureException(e)
      notifyMessage("Failed to update")
    } finally {
      setLoading(false)
    }
  }

  const mealPreferenceToIndex = (mealPreference) => {
    if (mealPreference === "all") {
      return 0;
    } else if (mealPreference === "veg") {
      return 1;
    } else {
      return 2;
    }
  }

  const indexToMealPreference = (index) => {
    if (index == 0) {
      return "all";
    } else if (index == 1) {
      return "veg";
    } else {
      return "egg"
    }
  }

  const goToAddAddress = () => {
    navigation.navigate("AddAddress", {
      add: true
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{name}</Text>
        <View style={styles.profileMetadata}>
          <Text style={styles.profileMetadataText}>
            {phone}
          </Text>
          {createdOn && (
            <Text style={styles.profileMetadataText}>
              Member since {moment(createdOn).format("MMM DD, YYYY")}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>
          Meal Preference
        </Text>
        <RadioGroup
          style={styles.mealPreferenceContainer}
          onChange={setMealPreferenceIndex}
          selectedIndex={mealPreferenceIndex}>
          <Radio>All (Non Veg)</Radio>
          <Radio>Veg</Radio>
          <Radio>Egg</Radio>
        </RadioGroup>
        <Button
          appearance="outline"
          size="small"
          disabled={loading}
          onPress={updateMealPreference}
          style={styles.button}>
          UPDATE
        </Button>
      </View>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.label}>
            Saved Address
          </Text>
          {addressLoading && (
            <ActivityIndicator style={{ marginRight: 10 }} color="black" />
          )}
          {!addressLoading && addressDetails?.map(addressDetail => {
            return (
              <Address
                id={addressDetail.id}
                label={addressDetail.label}
                address={addressDetail.address}
                pincode={addressDetail.pincode}
                navigation={navigation} />
            )
          })}
          {!addressLoading && (!addressDetails || addressDetails.length == 0) && (
            <Button
              onPress={goToAddAddress}
              appearance="outline"
              size="small"
              style={{ marginTop: 10 }}>
              Add Address
            </Button>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

const addressStyles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 10,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "white"
  },
  label: {
    textTransform: "uppercase",
    fontWeight: "bold",
    marginBottom: 5,
    color: "black"
  },
  address: {
    color: "black"
  }
})

const Address = (props) => {
  const {id, label, address, pincode, navigation} = props
  const icon = label?.toLowerCase() === "home" ? "home-outline" : "location-outline";

  const goToUpdateAddress = () => {
    navigation.navigate("AddAddress", {
      add: false,
      id: id,
      initialLabel: label,
      initialAddress: address,
      initialPincode: pincode
    })
  }

  return (
    <View style={addressStyles.container}>
      <View style={{ backgroundColor: "white" }}>
        <Ionicons size={18} name={icon} color={"#4F4946"} />
      </View>
      <View style={{ marginLeft: 15, flexShrink: 1, backgroundColor: "white" }}>
        <Text style={addressStyles.label}>{label}</Text>
        <Text style={addressStyles.address}>{address}</Text>
        <Text style={addressStyles.address}>Pincode - {pincode}</Text>

        <Button appearance="outline" size="small" style={styles.button} status="warning" onPress={goToUpdateAddress}>
          UPDATE
        </Button>
      </View>
    </View>
  )
}

export default ProfileScreen

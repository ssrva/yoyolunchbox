import * as React from 'react'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import {
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native'
import { Text, View } from '../../components/Themed'
import { notifyMessage, primaryColor } from "../../commonUtils"
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Input, RadioGroup, Radio } from '@ui-kitten/components';
import commonStyles from "./styles"
import * as api from "../../api"
import moment from 'moment'
import * as Location from 'expo-location'
import { ScrollView } from 'react-native-gesture-handler'

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
    fontSize: 24,
    marginBottom: 10,
  },
  profileMetadata: {
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
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
    flexDirection: "row",
    marginBottom: 20,
  },
  profilePictureContainer: {
    height: 120,
    width: 120,
    padding: 5,
    borderWidth: 5,
    borderColor: "rgba(242, 201, 76, 0.5)",
    borderRadius: 60,
    marginRight: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: "cover",
  },
  profileMetadataText: {
    color: "black",
    fontStyle: "italic"
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
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  }
})

const ProfileScreen = (props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const user = useSelector(store => store.user)
  const [name, setName] = useState<string>(user.attributes?.name || "")
  const [address, setAddress] = useState<string>("")
  const [createdOn, setCreatedOn] = useState<string>()
  const [mealPreferenceIndex, setMealPreferenceIndex] = useState<number>(3)
  const [userCoordinates, setUserCoordinates] = useState<Object>({
    latitude: 13.067439, longitude: 80.237617
  })

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== "granted") {
      console.log("Permission not granted")
      // General location in Chennai if user does not grant location permission
      return {
        latitude: 13.067439,
        longitude: 80.237617
      }
    }

    let location = await Location.getCurrentPositionAsync({})
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    }
  }

  useEffect(() => {
    const fetchProfileData = async () => {
      const details = await api.getUserDetails(user.username)
      setAddress(details.address)
      setCreatedOn(details.created_on)
      if (!details.coordinates) {
        const location = await getLocation()
        setUserCoordinates(location)
      } else {
        setUserCoordinates(details.coordinates)
      }
      setMealPreferenceIndex(mealPreferenceToIndex(details.meal_preference))
    }
    fetchProfileData()
  }, [])

  const updateProfile = async () => {
    const details = {
      coordinates: userCoordinates,
      address: address,
      phone: user.attributes.phone_number,
      meal_preference: indexToMealPreference(mealPreferenceIndex)
    }
    setLoading(true)
    try {
      await api.updateUserDetails(user.username, details)
      notifyMessage("Updated user successfully")
    } catch (e) {
      console.log(e.message)
      notifyMessage("Failed to update user")
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileMetadata}>
          <Text style={styles.title}>{name}</Text>
          {createdOn && (
            <Text style={styles.profileMetadataText}>
              Member since {moment(createdOn).format("MMM DD, YYYY")}
            </Text>
          )}
        </View>
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView>
          <View style={styles.formElements}>
            <Text style={styles.label}>
              Address
            </Text>
            <Input
              value={address}
              textStyle={{ height: 100 }}
              multiline
              numberOfLines={4}
              style={styles.input}
              onChangeText={setAddress} />
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
            <Text style={styles.label}>
              Choose Location on Map
            </Text>
            <View style={styles.mapContainer}>
              <MapView
                provider={PROVIDER_GOOGLE}
                region={{
                  latitude: userCoordinates.latitude,
                  longitude: userCoordinates.longitude,
                  latitudeDelta: 0.001,
                  longitudeDelta: 0.001,
                }}
                onPress={(coordinates) => {
                  setUserCoordinates({
                    latitude: coordinates.nativeEvent.coordinate.latitude,
                    longitude: coordinates.nativeEvent.coordinate.longitude
                  })
                }}
                style={styles.map}>
                <Marker
                  coordinate={{
                    latitude : userCoordinates.latitude ,
                    longitude : userCoordinates.longitude
                  }}
                  title="User Location"/>
              </MapView>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
      <TouchableOpacity
        disabled={loading}
        onPress={updateProfile}
        style={commonStyles.mainButton}>
        {loading && (<ActivityIndicator style={{ marginRight: 10 }} color="white" />)}
        <Text style={{ color: "white" }}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ProfileScreen

import * as React from 'react'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import { API, Auth } from 'aws-amplify'
import { Keyboard, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { Text, View } from '../../components/Themed'
import { notifyMessage, primaryColor } from "../../commonUtils"
import { connect, useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { COLORS } from "../../commonUtils"
import { Button, Input } from '@ui-kitten/components';
import commonStyles from "./styles"
import { Ionicons } from '@expo/vector-icons'
import { setUser } from '../../store/actions'
import * as api from "../../api"

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    display: "flex",
  },
  title: {
    fontWeight: "800",
    fontSize: 24,
    backgroundColor: "white",
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.GRAY90,
    flex: 1,
  },
  formElements: {
    flex: 1,
  },
  input: {
    marginBottom: 20,
  },
  header: {
    display: "flex",
    flexDirection: "row",
  },
  logoutButton: {
    borderRadius: 50,
    padding: 10,
    backgroundColor: primaryColor,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: "100%",
    height: 300,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 4
  }
})

const ProfileScreen = (props) => {
  const defaultCoordinates = {
    latitude: 13.067439,
    longitude: 80.237617
  }
  const { navigation } = props
  const user = useSelector(store => store.user)
  const [name, setName] = useState<string>(user.attributes?.name || "")
  const [address, setAddress] = useState<string>("")
  const [userCoordinates, setUserCoordinates] = useState<Object>(
    defaultCoordinates
  )
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchProfileData = async () => {
      const details = await api.getUserDetails(user.username)
      setAddress(details.address)
      setUserCoordinates(details.coordinates || defaultCoordinates)
    }
    fetchProfileData()
  }, [])

  const updateProfile = async () => {
    const details = {
      coordinates: userCoordinates,
      address: address,
      phone: user.attributes.phone_number,
    }
    try {
      await api.updateUserDetails(user.username, details)
      notifyMessage("Updated user successfully")
    } catch (e) {
      console.log(e.message)
      notifyMessage("Failed to update user")
    }
  }

  const logout = async () => {
    await Auth.signOut()
    dispatch(setUser({ user: {} }))
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hello {name}!</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons size={20} name="log-out-outline" color="white" />
        </TouchableOpacity>
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.formElements}>
          <Text>
            Name
          </Text>
          <Input
            value={name}
            style={styles.input}
            onChangeText={setName} />
          <Text>
            Address
          </Text>
          <Input
            value={address}
            multiline
            numberOfLines={4}
            style={styles.input}
            onChangeText={setAddress} />
          <Text>
            Choose Location on Map
          </Text>
          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: userCoordinates.latitude,
                longitude: userCoordinates.longitude,
                latitudeDelta: 0.04,
                longitudeDelta: 0.05,
              }}
              onPress={(coordinates) => {
                setUserCoordinates({
                  latitude: coordinates.nativeEvent.coordinate.latitude,
                  longitude: coordinates.nativeEvent.coordinate.longitude
                })
                console.log("touched ", coordinates.nativeEvent.coordinate)
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
      </TouchableWithoutFeedback>
      <Button onPress={updateProfile} style={commonStyles.mainButton}>
        Update Profile
      </Button>
    </View>
  )
}

export default ProfileScreen

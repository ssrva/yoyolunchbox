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
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { COLORS } from "../../commonUtils"
import { Button, Input } from '@ui-kitten/components';
import commonStyles from "./styles"
import * as api from "../../api"
import moment from 'moment'

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    display: "flex",
  },
  label: {
    marginBottom: 10,
    fontWeight: "bold"
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 10,
  },
  profileMetadata: {
    display: "flex",
    justifyContent: "center",
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
    fontStyle: "italic"
  },
  logoutButton: {
    borderRadius: 50,
    padding: 10,
    backgroundColor: primaryColor,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  map: {
    width: "100%",
    height: "100%",
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
  const [loading, setLoading] = useState<boolean>(false)
  const user = useSelector(store => store.user)
  const [name, setName] = useState<string>(user.attributes?.name || "")
  const [address, setAddress] = useState<string>("")
  const [createdOn, setCreatedOn] = useState<string>()
  const [userCoordinates, setUserCoordinates] = useState<Object>(
    defaultCoordinates
  )

  useEffect(() => {
    const fetchProfileData = async () => {
      const details = await api.getUserDetails(user.username)
      setAddress(details.address)
      setCreatedOn(details.created_on)
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profilePictureContainer}>
          <Image
            style={styles.profilePicture}
            source={require("../../static/images/logo.png")} />
        </View>
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

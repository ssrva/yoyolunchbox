import * as React from 'react'
import { Button, Image, TextInput, useWindowDimensions } from 'react-native'
import { Text, View } from '../../components/Themed'
import firebase from "firebase/app"
import { notifyMessage } from "../../commonUtils"
import { connect, useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { setUser } from '../../store/actions'
import Header from './components/Header'
import { primaryBackgroundColor } from "../../commonUtils"
import { ScrollView } from 'react-native-gesture-handler'
import styles from "./styles"


const ProfileScreen = () => {
  const user = firebase.auth().currentUser
  const userDetails = useSelector(store => store.user.details)
  const [name, setName] = useState<string>(userDetails.name || "")
  const [address, setAddress] = useState<string>(userDetails.address || "")
  const dispatch = useDispatch()

  const updateProfile = () => {
    const updatedDetails = {
      ...userDetails,
      name: name,
      address: address,
    }
    firebase.firestore().collection("users").doc(user.uid).set(updateProfile)
      .then(() => {
        dispatch(setUser({ user: updatedDetails }))
        notifyMessage("Profile updated successfully!")
      })
  }

  return (
    <View style={styles.mainViewStyle}>
      <Header />
      <View style={styles.innerContainer}>
        <Text>Name</Text>
        <TextInput
          value={name}
          style={styles.input}
          onChangeText={setName} />
        <Text>Address</Text>
        <TextInput
          value={address}
          multiline
          numberOfLines={4}
          style={styles.input}
          onChangeText={setAddress} />
        <Button
          onPress={updateProfile}
          title="Update Profile"/>
      </View>
    </View>
  )
}

export default ProfileScreen

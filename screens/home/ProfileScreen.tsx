import * as React from 'react'
import { Keyboard, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { Text, View } from '../../components/Themed'
import firebase from "firebase/app"
import { notifyMessage, primaryColor } from "../../commonUtils"
import { connect, useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { setUser } from '../../store/actions'
import Header from './components/Header'
import { primaryBackgroundColor } from "../../commonUtils"
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { COLORS } from "../../commonUtils"
import { Button, Input } from '@ui-kitten/components';
import commonStyles from "./styles"
import { Ionicons } from '@expo/vector-icons'

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
  }
})

const ProfileScreen = (props) => {
  const { navigation } = props
  const user = firebase.auth().currentUser
  const userDetails = useSelector(store => store.user.details)
  const [name, setName] = useState<string>(userDetails?.name || "")
  const [address, setAddress] = useState<string>(userDetails?.address || "")
  const dispatch = useDispatch()

  const updateProfile = () => {
    const updatedDetails = {
      ...userDetails,
      name: name,
      address: address,
    }
    firebase.firestore().collection("users").doc(user.uid).set(updatedDetails)
      .then(() => {
        dispatch(setUser({ user: updatedDetails }))
        notifyMessage("Profile updated successfully!")
      })
  }

  const logout = () => {
    firebase.auth().signOut().then(function() {
      dispatch(setUser({ user: {} }))
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hello {userDetails?.name || name}!</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons size={20} name="log-out-outline" color="white" />
        </TouchableOpacity>
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.formElements}>
          <Input
            label="Name"
            value={name}
            style={styles.input}
            onChangeText={setName} />
          <Input
            label="Address"
            value={address}
            multiline
            numberOfLines={4}
            style={styles.input}
            onChangeText={setAddress} />
        </View>
      </TouchableWithoutFeedback>
      <Button onPress={updateProfile} style={commonStyles.mainButton}>
        Update Profile
      </Button>
    </View>
  )
}

export default ProfileScreen

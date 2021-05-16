import _ from "lodash"
import { StatusBar } from 'expo-status-bar'
import { createStore } from "redux"
import { Provider, useDispatch, useSelector } from "react-redux"
import firebase from 'firebase/app'
import React, { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import useCachedResources from './hooks/useCachedResources'
import LoginScreen from './screens/login/LoginScreen'
import LoggedInNavigator from "./screens/home/LoggedInNavigator"
import reducer from "./store/reducer"
import { setUser } from './store/actions'
import { Text } from "react-native"

const store = createStore(reducer)

const MainApp = () => {
  const isLoadingComplete = useCachedResources()
  const [loading, setLoading] = useState<boolean>(true)
  const dispatch = useDispatch()
  const user = useSelector(store => store.user)

  useEffect(() => {
    setLoading(true)
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const userData = (
          await firebase.firestore().collection("users").doc(user.uid).get()
        ).data()
        dispatch(setUser({
          user: {
            ...user,
            details: userData,
          }
        }))
      }
      setLoading(false)
    })
  }, [])

  if (loading || !isLoadingComplete) {
    return (
      <Text>Loading...</Text>
    )
  } else {
    return (
      <SafeAreaProvider>
        {_.isEmpty(user) ? (
          <LoginScreen />
        ) : (
          <LoggedInNavigator />
        )}
        <StatusBar />
      </SafeAreaProvider>
    )
  }
}

export default MainApp

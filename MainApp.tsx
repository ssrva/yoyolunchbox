import _ from "lodash"
import { StatusBar } from 'expo-status-bar'
import { createStore } from "redux"
import { Provider, useDispatch, useSelector } from "react-redux"
import * as firebase from 'firebase'
import React, { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import useCachedResources from './hooks/useCachedResources'
import LoginScreen from './screens/login/LoginScreen'
import MainNavigator from "./screens/MainNavigator"
import reducer from "./store/reducer"
import { setUser } from './store/actions'
import { Appearance } from "react-native-appearance"
import * as eva from '@eva-design/eva';
import { Text } from "react-native"
import { ApplicationProvider } from '@ui-kitten/components';

const store = createStore(reducer)

const MainApp = () => {
  const isLoadingComplete = useCachedResources()
  const [loading, setLoading] = useState<boolean>(true)
  const dispatch = useDispatch()
  const user = useSelector(store => store.user)
  Appearance.set({ colorScheme: 'light' })

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
        <ApplicationProvider {...eva} theme={eva.light}>
          <MainNavigator />
        </ApplicationProvider>
      </SafeAreaProvider>
    )
  }
}

export default MainApp

import _ from "lodash"
import axios from "axios"
import { StatusBar } from 'expo-status-bar'
import { createStore } from "redux"
import { Provider, useDispatch, useSelector } from "react-redux"
import React, { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import useCachedResources from './hooks/useCachedResources'
import { Auth } from 'aws-amplify'
import MainNavigator from "./screens/MainNavigator"
import reducer from "./store/reducer"
import { setUser } from './store/actions'
import { Appearance } from "react-native-appearance"
import * as eva from '@eva-design/eva';
import { Text } from "react-native"
import { ApplicationProvider } from '@ui-kitten/components';
import * as api from "./api"

const store = createStore(reducer)

const MainApp = () => {
  const isLoadingComplete = useCachedResources()
  const [loading, setLoading] = useState<boolean>(true)
  const dispatch = useDispatch()
  Appearance.set({ colorScheme: 'light' })

  axios.defaults.baseURL = "https://uhgsmg1av7.execute-api.us-east-1.amazonaws.com/production";

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      try {
        const user = await Auth.currentAuthenticatedUser({ bypassCache: false })
        dispatch(setUser({ user }))
        const jwtToken = user.signInUserSession.idToken.jwtToken
        axios.defaults.headers.common['Authorization'] = jwtToken
      } catch(e) {
        console.log("Error in Main App", e)
      }
      setLoading(false)
    }

    fetchUserData()
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

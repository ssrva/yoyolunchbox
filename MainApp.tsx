import _ from "lodash"
import axios from "axios"
import { StatusBar } from 'expo-status-bar'
import { useDispatch } from "react-redux"
import React, { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import useCachedResources from './hooks/useCachedResources'
import { Auth } from 'aws-amplify'
import MainNavigator from "./screens/MainNavigator"
import { setUser } from './store/actions'
import * as eva from '@eva-design/eva'
import { Text } from "react-native"
import { ApplicationProvider } from '@ui-kitten/components'
import { Appearance } from 'react-native-appearance';
import * as Updates from 'expo-updates';
import * as Sentry from "@sentry/browser"

const MainApp = () => {
  const isLoadingComplete = useCachedResources()
  const [loading, setLoading] = useState<boolean>(true)
  const dispatch = useDispatch()
  Appearance.set({ colorScheme: 'light' })

  axios.defaults.baseURL = "https://api.yoyolunchbox.in";

  const getJwtToken = async () => {
    const user = await Auth.currentAuthenticatedUser({ bypassCache: false })
    return user.signInUserSession.idToken.jwtToken
  }  

  axios.interceptors.request.use((config) => {
    return getJwtToken().then((token) => {
      config.headers.common['Authorization'] = token
      return Promise.resolve(config)
    })
  }, (error) => {
    return Promise.reject(error)
  })

  const checkJsBundleUpdate = async () => {
    try {
      console.log("YOYO Lunchbox JS Bundle update available")
      const update = await Updates.checkForUpdateAsync();
      console.log(update)
      if (update.isAvailable) {
        console.log("YOYO Lunchbox JS Bundle update available")
        await Updates.fetchUpdateAsync();
        Updates.reloadAsync();
      }
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      console.log("Fetching user data");
      setLoading(true)
      try {
        const user = await Auth.currentAuthenticatedUser({ bypassCache: false })
        dispatch(setUser({ user }))
      } catch(e) {
        console.log("Error in Main App", e)
      }
      setLoading(false)
    }
    fetchUserData()
    checkJsBundleUpdate()
  }, [])

  if (loading || !isLoadingComplete) {
    return (
      <Text>Loading...</Text>
    )
  } else {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <ApplicationProvider {...eva} theme={eva.light}>
          <MainNavigator />
        </ApplicationProvider>
      </SafeAreaProvider>
    )
  }
}

export default MainApp

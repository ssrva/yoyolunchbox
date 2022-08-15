import _ from "lodash"
import axios from "axios"
import { StatusBar } from 'expo-status-bar'
import { useDispatch } from "react-redux"
import React, { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import useCachedResources from './hooks/useCachedResources'
import { Auth } from 'aws-amplify'
import MainNavigator from "./screens/MainNavigator"
import { setUserWithTracking } from './store/actions'
import * as eva from '@eva-design/eva'
import { Text } from "react-native"
import { ApplicationProvider } from '@ui-kitten/components'
import { Appearance } from 'react-native-appearance';
import * as Updates from 'expo-updates';
import * as Sentry from "@sentry/browser"
import * as Amplitude from 'expo-analytics-amplitude';
import getEnvironmentVariables from "common/environments"
import * as api from "api"
import NetInfo from '@react-native-community/netinfo';
import NetworkErrorScreen from "./screens/NetworkErrorScreen"

const MainApp = () => {
  const isLoadingComplete = useCachedResources()
  const [loading, setLoading] = useState<boolean>(true)
  const [isNetworkConnected, setIsNetworkConnected] = useState<boolean>(true)
  const dispatch = useDispatch()
  Appearance.set({ colorScheme: 'light' })

  axios.defaults.baseURL = getEnvironmentVariables().baseUrl;
  
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
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        console.log("YOYO Lunchbox JS Bundle update available")
        await Updates.fetchUpdateAsync();
        Updates.reloadAsync();
      }
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  const initializeAmplitude = async () => {
    Amplitude.initializeAsync(getEnvironmentVariables().amplitudeApiKey);
  }

  const fetchUserData = async () => {
    setLoading(true)
    try {
      const user = await Auth.currentAuthenticatedUser({ bypassCache: false })
      const postgresUserDetails = await api.getUserDetails(user.username)
      dispatch(setUserWithTracking({
        user: {
          ...user,
          ...postgresUserDetails
        }
      }))
    } catch(e) {
      console.log("Error in Main Application", e)
      const networkState = await NetInfo.fetch();
      if (!networkState.isConnected) {
        setIsNetworkConnected(false)
      }
    }
    setLoading(false)
  }

  const initData = () => {
    fetchUserData()
    checkJsBundleUpdate()
    initializeAmplitude()
  }

  const checkConnectivityAndFetchInitData = async () => {
    setLoading(true)
    const networkState = await NetInfo.fetch();
    if (networkState.isConnected) {
      setIsNetworkConnected(true);
      initData();
    } else {
      setLoading(false)
      setIsNetworkConnected(false);
    }
  }

  useEffect(() => {
    checkConnectivityAndFetchInitData();
  }, [])

  if (loading || !isLoadingComplete) {
    return (
      <Text>Loading...</Text>
    )
  } else if (!isNetworkConnected) {
    return (
      <ApplicationProvider {...eva} theme={eva.light}>
        <NetworkErrorScreen retry={checkConnectivityAndFetchInitData} />
      </ApplicationProvider>
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

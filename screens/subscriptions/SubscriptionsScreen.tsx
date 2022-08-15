import _ from "lodash"
import moment from "moment"
import * as React from 'react';
import { useEffect, useState } from 'react';
import { TouchableWithoutFeedback, View, Text, StyleSheet, Keyboard, ActivityIndicator, Modal } from 'react-native';
import * as api from "../../api"
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Radio } from "@ui-kitten/components";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from '@expo/vector-icons';
import { notifyMessage, secondaryColor, COLORS } from "common/utils";
import RNPgReactNativeSdk from "react-native-pg-react-native-sdk/bridge";
import Spinner from "../home/components/Spinner"
import { setBalance } from "../../store/actions"
import * as Sentry from "@sentry/browser"
import * as Amplitude from "expo-analytics-amplitude"
import getEnvironmentVariables from "common/environments";
import SubscriptionPlans from "./SubscriptionPlans";
import ActiveSubscription from "./ActiveSubscription";
import { TSubscription } from "common/types";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    display: "flex",
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center"
  }
})


const SubscriptionsScreen = (props) => {
  const user = useSelector(store => store.user)
  const [activeSubscription, setActiveSubscription] = useState<TSubscription>({})
  const [loading, setLoading] = useState<boolean>(false)

  const getSubscriptionDetails = async() => {
    setLoading(true)
    const activeSubscription = await api.getSubscription(user.username)
    setActiveSubscription(activeSubscription)
    setLoading(false)
  }

  useEffect(() => {
    getSubscriptionDetails();
  }, [])

  return (
    <>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={"black"} />
        </View>
      ) : activeSubscription.active ? (
        <View style={styles.container}>
          <ActiveSubscription
            refresh={getSubscriptionDetails}
            subscription={activeSubscription} />
        </View>
      ) : (
        <View style={styles.container}>
          <SubscriptionPlans refresh={getSubscriptionDetails} />
        </View>
      )}
    </>
  )
}

export default SubscriptionsScreen
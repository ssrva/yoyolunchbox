import _ from "lodash"
import moment from "moment"
import * as React from 'react';
import { useEffect, useState } from 'react';
import { TouchableWithoutFeedback, View, Text, StyleSheet, Keyboard, ActivityIndicator, Image } from 'react-native';
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
import { TSubscription } from "common/types";
import { PlacementOptions } from "@ui-kitten/components/ui/popover/type";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "white",
    padding: 40
  },
  planName: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 40
  },
  image: {
    width: 175,
    height: 175,
    resizeMode: "contain",
    marginBottom: 50
  },
  planMetadataView: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  metadataKey: {
    fontWeight: "bold"
  }
})

type TActiveSubscriptionProps = {
  subscription: TSubscription,
  refresh: Function
}

const ActiveSubscription = (props: TActiveSubscriptionProps) => {
  const { subscription, refresh } = props

  const getImage = () => {
    if (subscription.plan == "Bronze") {
      return (
        <Image
          style={styles.image}
          source={require(`../../static/images/bronze.png`)} />
      )
    }
    if (subscription.plan == "Silver") {
      return (
        <Image
          style={styles.image}
          source={require(`../../static/images/silver.png`)} />
      )
    }
    if (subscription.plan == "Gold") {
      return (
        <Image
          style={styles.image}
          source={require(`../../static/images/gold.png`)} />
      )
    }
    return <></>
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, display: "flex", alignItems: "center" }}>
        {getImage()}
        <Text style={styles.planName}>Wohoo! Your {subscription.plan} plan is active!</Text>
        <View style={styles.planMetadataView}>
          <Text style={styles.metadataKey}>Purchased on</Text>
          <Text>{subscription.start_date.substring(0, 10)}</Text>
        </View>
        <View style={styles.planMetadataView}>
          <Text style={styles.metadataKey}>Valid Until</Text>
          <Text>{subscription.end_date.substring(0, 10)}</Text>
        </View>
        <View style={styles.planMetadataView}>
          <Text style={styles.metadataKey}>Free Deliveries Left</Text>
          <Text>{subscription.free_deliveries_left}</Text>
        </View>
      </View>
      <View>
        <Button status="basic" onPress={refresh}>
          Refresh
        </Button>
      </View>
    </View>
  )
}

export default ActiveSubscription;
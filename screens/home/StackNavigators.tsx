import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from "./HomeScreen"
import Orders from "./Orders"
import ProfileScreen from "./ProfileScreen"
import OrderConfirmation from "./OrderConfirmation";
import { primaryColor } from "../../commonUtils"
import { Text, View } from '../../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import * as api from "../../api"
import Transactions from "./Transactions"

const Stack = createStackNavigator()
const Tab = createMaterialTopTabNavigator()

const styles = StyleSheet.create({
  locationIcon: {
    marginRight: 10,
  },
  headerAddress: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  locationText: {
    fontSize: 18,
    textDecorationLine: "underline"
  },
  wallet: {
    backgroundColor: "#C4C4C4",
    padding: 5,
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  }
})

const WalletBalanceComponent = (props) => {
  const { navigation } = props
  const username = useSelector(store => store.user?.username)
  const [balance, setBalance] = useState<Number>(0)

  useEffect(() => {
    const getBalance = async () => {
      const balance = await api.getUserWalletBalance(username)
      setBalance(balance?.balance)
    }
    getBalance()
  }, [])

  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate("Transactions")}>
      <View style={styles.wallet}>
        <Ionicons
          size={20}
          name="wallet"
          style={{ marginRight: 10 }}
          color={"black"} />
        <Text style={{ fontWeight: "bold" }}>{'\u20B9'}{balance}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

const headerOptions = ({route, navigation}) => ({
  headerStyle: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    height: 80,
  },
  headerTitleAlign: "left",
  headerTitle: () => (
    <View style={styles.headerAddress}>
      <Ionicons size={20} name="location" color={"#4F4946"} style={styles.locationIcon} />
      <Text style={styles.locationText}>Home</Text>
    </View>
  ),
  headerLeft: () => (
    <TouchableOpacity
      style={{ marginRight: 10 }}
      onPress={() => navigation.openDrawer()}>
      <Ionicons size={24} name="menu" color={"#4F4946"} />
    </TouchableOpacity>
  ),
  headerRight: () => (
    <WalletBalanceComponent navigation={navigation} />
  ),
  headerTintColor: "#000",
  headerTitleContainerStyle: {
    marginLeft: -10,
  },
  headerLeftContainerStyle: {
    marginLeft: 15,
  },
  headerRightContainerStyle: {
    marginRight: 15,
  }
})

export const HomeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Confirm Order" component={OrderConfirmation} />
      <Stack.Screen name="Transactions" component={Transactions} />
    </Stack.Navigator>
  );
};

export const OrdersNavigator = () => {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="Orders" component={OrderTabsNavigator} />
    </Stack.Navigator>
  );
};

const OrderTabsNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="On Route"
        component={Orders}
        initialParams={{ status: "on_route" }} />
      <Tab.Screen
        name="Upcoming"
        component={Orders}
        initialParams={{ status: "upcoming" }} />
      <Tab.Screen
        name="Cancelled"
        component={Orders}
        initialParams={{ status: "cancelled" }} />
    </Tab.Navigator>
  );
}

export const ProfileNavigator = () => {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

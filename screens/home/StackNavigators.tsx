import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, StyleSheet } from "react-native";
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

const Stack = createStackNavigator()

const styles = StyleSheet.create({
  locationIcon: {
    marginRight: 10,
  },
  headerAddress: {
    marginTop: -15,
    marginLeft: -15,
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

const WalletBalanceComponent = () => {
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
    <View style={styles.wallet}>
      <Ionicons
        size={20}
        name="wallet"
        style={{ marginRight: 10 }}
        color={"black"} />
      <Text style={{ fontWeight: "bold" }}>{'\u20B9'}{balance}</Text>
    </View>
  )
}

const headerOptions = ({route, navigation}) => ({
  headerStyle: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    height: 120,
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
    <WalletBalanceComponent />
  ),
  headerTintColor: "#000",
  headerTitleContainerStyle: {
    margin: 0,
  },
  headerLeftContainerStyle: {
    margin: 15,
    marginRight: 0,
    marginTop: 0
  },
  headerRightContainerStyle: {
    margin: 15,
    marginTop: 0
  }
})

export const HomeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Confirm Order" component={OrderConfirmation} />
      <Stack.Screen name="Wallet" component={OrderConfirmation} />
    </Stack.Navigator>
  );
};

export const OrdersNavigator = () => {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="Orders" component={Orders} />
    </Stack.Navigator>
  );
};

export const ProfileNavigator = () => {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

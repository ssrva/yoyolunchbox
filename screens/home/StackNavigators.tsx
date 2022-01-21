import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from "./HomeScreen"
import Orders from "./Orders"
import ProfileScreen from "./ProfileScreen"
import AddAddress from './AddAddress';
import AddMoneyScreen from "./AddMoneyScreen"
import OrderConfirmation from "./OrderConfirmation";
import { primaryColor } from "../../commonUtils"
import { Text, View } from '../../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import * as api from "../../api"
import Transactions from "./Transactions"
import { refreshBalance } from '../../store/actions'
import Colors from 'yoyoconstants/Colors';

const Stack = createStackNavigator()
const Tab = createMaterialTopTabNavigator()

const styles = StyleSheet.create({
  locationIcon: {
    marginRight: 10,
  },
  headerAddress: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.theme.background
  },
  locationText: {
    fontSize: 18,
    textDecorationLine: "underline",
    color: Colors.theme.textColor
  },
  wallet: {
    backgroundColor: Colors.theme.backgroundDark,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  }
})

const WalletBalanceComponent = (props) => {
  const { navigation } = props
  const balance = useSelector(store => store.balance)
  const username = useSelector(store => store.user?.username)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(refreshBalance())
  }, [])

  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate("Transactions")}>
      <View style={styles.wallet}>
        <Ionicons
          size={20}
          name="wallet"
          style={{ marginRight: 5 }}
          color={Colors.theme.secondary} />
        <Text style={{ fontWeight: "bold", color: Colors.theme.textDark }}>{'\u20B9'}{balance}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

const headerOptions = ({route, navigation}) => ({
  headerStyle: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    backgroundColor: Colors.theme.background
  },
  headerTitleAlign: "left",
  headerTitle: () => (
    <View style={styles.headerAddress}>
      <Ionicons size={20} name="location" color={Colors.theme.secondary} style={styles.locationIcon} />
      <Text style={styles.locationText}>Home</Text>
    </View>
  ),
  headerLeft: () => {
    const routes = navigation?.getState()?.routes
    const currentRoute = routes?.[routes.length - 1]?.name
    const backButtonScreens = ["Transactions"]
    return backButtonScreens.includes(currentRoute) ? (
      <TouchableOpacity
        style={{ marginRight: 10 }}
        onPress={() => navigation.pop()}>
        <Ionicons size={24} name="chevron-back" color={"#4F4946"} />
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        style={{ marginRight: 10 }}
        onPress={() => navigation.openDrawer()}>
        <Ionicons size={24} name="menu" color={Colors.theme.secondary} />
      </TouchableOpacity>
    )
  },
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
      {/* <Tab.Screen
        name="On Route"
        component={Orders}
        initialParams={{ status: "on_route" }} /> */}
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
    <Stack.Navigator screenOptions={headerOptions} initialRouteName="Profile">
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="AddAddress" component={AddAddress} />
    </Stack.Navigator>
  );
};

export const AddMoneyNavigator = () => {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="Add Money" component={AddMoneyScreen} />
    </Stack.Navigator>
  );
};

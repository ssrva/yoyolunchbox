import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from "./HomeScreen"
import Orders from "./Orders"
import ProfileScreen from "./ProfileScreen"
import OrderConfirmation from "./OrderConfirmation";
import { primaryColor } from "../../commonUtils"

const Stack = createStackNavigator();

const headerOptions = {
  headerStyle: {
    backgroundColor: primaryColor,
  },
  headerTitleAlign: "left",
  headerTitle: "YOYO Lunchbox",
  headerLeft: () => null,
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
}

export const HomeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Confirm Order" component={OrderConfirmation} />
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

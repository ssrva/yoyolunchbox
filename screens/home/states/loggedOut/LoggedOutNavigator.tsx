import _ from "lodash"
import React from 'react'
import { StyleSheet, TouchableOpacity } from "react-native"
import { createStackNavigator } from '@react-navigation/stack';
import { AppearanceProvider } from "react-native-appearance"
import Login from "../../../login/Login"
import ExploreMenu from "./ExploreMenu"
import { Ionicons } from '@expo/vector-icons'
import { Text, View } from '../../../../components/Themed';
import AddAddress from "../../../login/AddAddress";

const Stack = createStackNavigator()

const styles = StyleSheet.create({
  headerIcon: {
    marginRight: 10,
  },
  headerTitleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white"
  },
  headerTitleText: {
    fontSize: 18,
    color: "black"
  },
})

const headerOptions = ({route, navigation}) => ({
  headerStyle: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0
  },
  headerTitleAlign: "left",
  headerTitle: () => (
    <View style={styles.headerTitleContainer}>
      <Ionicons size={20} name="search" color={"#4F4946"} style={styles.headerIcon} />
      <Text style={styles.headerTitleText}>Explore YOYO Lunchbox</Text>
    </View>
  ),
  headerLeft: () => {
    return (
      <TouchableOpacity
        style={{ marginRight: 10 }}
        onPress={() => navigation.pop()}>
        <Ionicons size={24} name="chevron-back" color={"#4F4946"} />
      </TouchableOpacity>
    )
  },
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

const LoggedOutNavigator = (props) => {

  return (
    <AppearanceProvider>
        <Stack.Navigator screenOptions={headerOptions}>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="AddAddress" component={AddAddress} options={{ headerShown: false }} />
            <Stack.Screen name="Explore" component={ExploreMenu} />
        </Stack.Navigator>
    </AppearanceProvider>
  );
}

export default LoggedOutNavigator

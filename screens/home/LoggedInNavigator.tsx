import _ from "lodash"
import moment from "moment"
import Constants from "expo-constants"
import { Auth } from 'aws-amplify'
import React, { useEffect } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking
} from "react-native"
import { Ionicons } from '@expo/vector-icons'
import {
  createDrawerNavigator,
  DrawerItemList
} from '@react-navigation/drawer'
import {
  HomeNavigator,
  OrdersNavigator,
  ProfileNavigator,
  AddMoneyNavigator
} from "./StackNavigators"
import { useDispatch, useSelector } from 'react-redux';
import { setMenu, setUser, setUserPreferences } from "../../store/actions"
import * as api from "../../api"
import { primaryColorDark } from "../../commonUtils"
import { AppearanceProvider } from "react-native-appearance"

const Drawer = createDrawerNavigator()

const styles = StyleSheet.create({
  sidebar: {
    marginTop: 30,
    marginBottom: 30,
    display: "flex",
    flexDirection: "column",
    height: "100%"
  },
  header: {
    display: "flex",
    borderBottomColor: "#D1D1D1",
    marginTop: 0,
    margin: 20,
    borderBottomWidth: 1,
  },
  name: {
    paddingBottom: 20,
    fontWeight: "bold",
    fontSize: 18,
  },
  logoContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10
  },
  logo: {
    width: 125,
    height: 100,
    resizeMode: "contain",
  },
  menu: {
    flex: 1
  },
  footer: {
    margin: 10,
    marginBottom: 35
  },
  logout: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#DC3545",
    marginBottom: 10,
  },
  footerText: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  }
})

const LoggedInNavigator = (props) => {
  const dispatch = useDispatch()
  const user = useSelector(store => store.user)

  const logout = async () => {
    await Auth.signOut()
    dispatch(setUser({ user: {} }))
  }

  useEffect(() => {
    const fetchMenuDetails = async () => {
      const datesToFetch = []
      const today = moment().format("YYYY-MM-DD")
      for(let i = 0; i < 7; i++) {
        datesToFetch.push(moment(today).add(i, 'd').format("YYYY-MM-DD"))
      }
      let menu = await api.getMenu(datesToFetch, user.username)
      menu = _.groupBy(menu, "date")
      dispatch(setMenu({ menu: menu }))
    }
    fetchMenuDetails()
  }, [])

  return (
    <AppearanceProvider>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => (
          <CustomDrawerContent {...props} user={user} logout={logout} />
        )}>
        <Drawer.Screen
          name="Home"
          options={{
            drawerIcon: ({focused, size}) => (
              <Ionicons size={20} name="home" color={primaryColorDark} />
            ),
          }}
          component={HomeNavigator} />
        <Drawer.Screen
          name="Orders"
          options={{
            drawerIcon: ({focused, size}) => (
              <Ionicons size={20} name="cart" color={primaryColorDark} />
            ),
          }}
          component={OrdersNavigator} />
        <Drawer.Screen
          name="Profile"
          options={{
            drawerIcon: ({focused, size}) => (
              <Ionicons size={20} name="person" color={primaryColorDark} />
            ),
          }}
          component={ProfileNavigator} />
        <Drawer.Screen
          name="Add Money"
          options={{
            drawerIcon: ({focused, size}) => (
              <Ionicons size={20} name="wallet" color={primaryColorDark} />
            ),
          }}
          component={AddMoneyNavigator} />
      </Drawer.Navigator>
    </AppearanceProvider>
  );
}

const CustomDrawerContent = (props) => {
  const { user, logout } = props
  return (
    <View style={styles.sidebar}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require("../../static/images/logo.png")} />
        </View>
        <Text style={styles.name}>
          Hello {user?.attributes?.name}!
        </Text>
      </View>
      <View style={styles.menu}>
        <DrawerItemList {...props} />
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={{ ...styles.logout, backgroundColor: "green" }}
          onPress={() => {
            Linking.openURL(
              "https://api.whatsapp.com/send/?phone=919916699112&text=I+am+a+customer+of+YOYO+LunchBox+and+want+help+with+my+order.&app_absent=0"
            )
          }}>
          <Ionicons
            size={20}
            name="logo-whatsapp"
            style={{ marginRight: 10 }}
            color="white" />
          <Text style={{ color: "white" }}>Talk to us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logout} onPress={logout}>
          <Ionicons
            size={20}
            name="power"
            style={{ marginRight: 10 }}
            color="white" />
          <Text style={{ color: "white" }}>LOGOUT</Text>
        </TouchableOpacity>
        <View style={styles.footerText}>
          <Text style={{ color: "#787878" }}>Made with </Text>
          <Ionicons
            size={20}
            name="heart"
            color="red" />
          <Text style={{ color: "#787878" }}> in India (v{Constants.manifest.extra?.jsPackageVersion})</Text>
        </View>
      </View>
    </View>
  );
}

export default LoggedInNavigator


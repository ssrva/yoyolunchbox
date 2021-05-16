import React, { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from "./HomeScreen"
import ProfileScreen from "./ProfileScreen"
import { primaryColor } from "../../commonUtils"
import firebase from "firebase/app"
import { useDispatch, useSelector } from 'react-redux';
import { setMenu } from '../../store/actions';

const BottomTab = createBottomTabNavigator();

const LoggedInNavigator = () => {
  const dispatch = useDispatch()
  const menu = useSelector(store => store.menu)

  useEffect(() => {
    const fetchMenuDetails = async () => {
      const datesToFetch = [
        "2021-05-16", "2021-05-17", "2021-05-18"
      ]
      const menu = {}
      for (const date of datesToFetch) {
        const menuForDate = await firebase.firestore().collection("menu").doc(date).get()
        menu[date] = menuForDate.data()
      }
      dispatch(setMenu({ menu: menu }))
    }
    fetchMenuDetails()
  }, [])

  return (
    <NavigationContainer>
      <BottomTab.Navigator
        initialRouteName="Home"
        tabBarOptions={{
          activeTintColor: primaryColor,
        }}>
        <BottomTab.Screen
          name="Home"
          options={{
            tabBarIcon: ({ color }) => {
              return (
                <Ionicons size={24} name="home" color={color} />
              )
            },
          }}
          component={HomeScreen} />
        <BottomTab.Screen
          name="Profile"
          options={{
            tabBarIcon: ({ color }) => {
              return (
                <Ionicons size={24} name="person" color={color} />
              )
            },
          }}
          component={ProfileScreen} />
      </BottomTab.Navigator>
    </NavigationContainer>
  );
};

function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

export default LoggedInNavigator;

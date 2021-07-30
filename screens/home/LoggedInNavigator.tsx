import _ from "lodash"
import React, { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeNavigator, OrdersNavigator, ProfileNavigator } from "./StackNavigators"
import { primaryColorDark } from "../../commonUtils"
import { useDispatch, useSelector } from 'react-redux';
import { setMenu } from '../../store/actions';
import * as api from "../../api"

const BottomTab = createBottomTabNavigator();

const LoggedInNavigator = (props) => {
  const dispatch = useDispatch()
  const user = useSelector(store => store.user)
  const menu = useSelector(store => store.menu)

  useEffect(() => {
    const fetchMenuDetails = async () => {
      const datesToFetch = [
        "2021-07-27", "2021-07-28", "2021-07-29"
      ]
      let menu = await api.getMenu(datesToFetch)
      menu = _.groupBy(menu, "date")
      dispatch(setMenu({ menu: menu }))
    }
    fetchMenuDetails()
  }, [])

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: primaryColorDark,
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
        component={HomeNavigator} />
      <BottomTab.Screen
        name="Orders"
        options={{
          tabBarIcon: ({ color }) => {
            return (
              <Ionicons size={24} name="cart" color={color} />
            )
          },
        }}
        component={OrdersNavigator} />
      <BottomTab.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ color }) => {
            return (
              <Ionicons size={24} name="person" color={color} />
            )
          },
        }}
        component={ProfileNavigator} />
    </BottomTab.Navigator>
  );
};

function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

export default LoggedInNavigator;


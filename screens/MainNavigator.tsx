import _ from "lodash"
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import LoggedInNavigator from "./home/LoggedInNavigator"
import Login from "./login/Login"

const Stack = createStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    primary: 'rgb(255, 45, 85)',
    background: 'rgb(242, 242, 242)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  },
};

const MainNavigator = (props) => {
  const user = useSelector(store => store.user)

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        {_.isNil(user) || _.isEmpty(user) ? (
          // No token found, user isn't signed in
          <Stack.Screen
            name="Login"
            component={Login} />
        ) : (
          // User is signed in
          <Stack.Screen name="LoggedIn" component={LoggedInNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;


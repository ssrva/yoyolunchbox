import _ from "lodash"
import React, { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { primaryColorDark } from "../commonUtils"
import firebase from "firebase/app"
import { useDispatch, useSelector } from 'react-redux';
import { setMenu } from '../store/actions';
import { NavigationContainer } from '@react-navigation/native';
import LoggedInNavigator from "./home/LoggedInNavigator"
import LoginScreen from "./login/LoginScreen"

const Stack = createStackNavigator();

const MainNavigator = (props) => {
  const user = useSelector(store => store.user)

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        {_.isNil(user) || _.isEmpty(user) ? (
          // No token found, user isn't signed in
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            // options={{
            //   title: 'Sign in',
            //   // When logging out, a pop animation feels intuitive
            //   // You can remove this if you want the default 'push' animation
            //   animationTypeForReplace: state.isSignout ? 'pop' : 'push',
            // }}
          />
        ) : (
          // User is signed in
          <Stack.Screen name="LoggedIn" component={LoggedInNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

export default MainNavigator;

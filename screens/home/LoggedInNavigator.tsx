import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from "./HomeScreen"
import ProfileScreen from "./ProfileScreen"
import { primaryColor } from "../../commonUtils"

const BottomTab = createBottomTabNavigator();

const LoggedInNavigator = () => {
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

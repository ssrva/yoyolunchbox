import {
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Application from 'expo-application';

export const primaryColor = "#F2C94C"
export const secondaryColor = "#4F4946"
export const primaryColorDark = "#134f56"
export const primaryBackgroundColor = "#F1F1F1"

export function notifyMessage(message: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT)
  } else if (Platform.OS == 'ios') {
    Alert.alert(message)
  } else {
    console.log(message)
  }
}

export const eligibleForNotifications = () => {
  if (Platform.OS === "android") {
    return Application.nativeBuildVersion && Application.nativeBuildVersion >= "12";
  } else if (Platform.OS === "ios") {
    return Application.nativeApplicationVersion && Application.nativeApplicationVersion >= "1.0.5";
  }
  return false;
}

export const getNotificationBody = (notification) => {
  if (Platform.OS === "android") {
    const body = notification?.notification?.request?.trigger?.remoteMessage?.data?.body || "{}";
    console.log(JSON.parse(body))
    return JSON.parse(body);
  } else if (Platform.OS === "ios") {
    return notification?.notification?.request?.trigger?.payload?.body || {};
  }
  return {}
}

export const getItemFromAsyncStorage = async (key: string) => {
  const data = await AsyncStorage.getItem(key)
  return data
}

export const putItemInAsyncStorage = async (key: string, value: string) => {
  await AsyncStorage.setItem(key, value)
}

export const COLORS = {
  BLACK: "hsl(0, 0%, 0%)",
  GRAY10: "hsl(0, 0%, 10%)",
  GRAY20: "hsl(0, 0%, 20%)",
  GRAY40: "hsl(0, 0%, 40%)",
  GRAY45: "hsl(0, 0%, 45%)",
  GRAY50: "hsl(0, 0%, 50%)",
  GRAY60: "hsl(0, 0%, 60%)",
  GRAY65: "hsl(0, 0%, 65%)",
  GRAY70: "hsl(0, 0%, 70%)",
  GRAY80: "hsl(0, 0%, 80%)",
  GRAY87: "hsl(60, 2%, 87%)",
  GRAY85: "hsl(0, 0%, 85%)",
  GRAY90: "hsl(0, 0%, 90%)",
  GRAY91: "hsl(0, 0%, 91%)",
  GRAY95: "hsl(0, 0%, 95%)",
  GRAY97: "hsl(0, 0%, 97%)",
  WHITE: "hsl(0, 0%, 100%)",

  GRAY_ALPHA_05: "hsla(0, 0%, 0%, 0.05)",
  GRAY_ALPHA_40: "hsla(0, 0%, 0%, 0.4)",
  GRAY_ALPHA_30: "hsla(0, 0%, 0%, 0.3)",
  GRAY_ALPHA_80: "hsla(0, 0%, 0%, 0.8)",

  GRAY_40_ALPHA_50: "hsla(0, 0%, 40%, 0.5)",

  BLUE95: "hsl(203, 100%, 95%)",
  BLUE40: "hsl(203, 100%, 40%)",
  BLUE60: "hsl(205, 100%, 60%)",
  BLUE30: "hsl(203, 100%, 30%)",
  AZURE30: "hsl(216, 100%, 30%)",
  BLUE65: "hsl(197, 59%, 65%)",
  BLUE100: "hsl(216, 100%, 20%)",
  BLUE100_ALPHA10: "hsla(216, 100%, 20%, 0.1)",
  LIGHT_BLUE_94: "hsl(210, 33%, 94%)",
  LIGHT_BLUE_86: "hsl(210, 20%, 86%)",
  AZURE50: "hsl(216, 100%, 50%)",
  LIGHT_BLUE_65: "hsl(205, 85%, 65%)",
  CASPER_BLUE: "hsl(209, 25%, 76%)",
  DODGER_BLUE: "hsl(209, 100%, 55%)",
  LIGHT_BLUE: "hsl(210, 33%, 94%)",

  AZURE100: "hsl(205, 85%, 40%)",
  BEIGE10: "hsl(43, 39%, 95%)",
  BEIGE90: "hsl(41, 37%, 90%)",
  BEIGE65: "hsl(42, 39%, 65%)",

  YELLOW50: "hsl(47, 100%, 50%)",

  ORANGE95: "hsl(48, 100%, 95%)",

  GREEN80: "hsl(118, 100%, 20%)",

  CRIMSON80: "hsl(0, 100%, 30%)",

  CRIMSON80_ALPHA_50: "hsla(0, 100%, 30%, 0.05)",

  SPRING_WOOD: "hsl(42, 38%, 95%)",

  GREEN40: "hsl(118, 70%, 40%)",
  RED50: "hsl(0, 100%, 50%)",
}

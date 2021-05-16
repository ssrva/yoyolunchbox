import {
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';

export const primaryColor = "#92710a"
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
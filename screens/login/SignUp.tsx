import * as React from 'react';
import { ImageBackground, Keyboard, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Text, View } from '../../components/Themed';
import { notifyMessage, primaryColor } from "../../commonUtils"
import { useSelector } from 'react-redux';
import { Input, Button } from "@ui-kitten/components"
import { Auth } from 'aws-amplify';
import styles from "./styles"

export default function SignUp() {
  const [name, setName] = React.useState<string>()
  const [username, setUsername] = React.useState<string>()
  const [password, setPassword] = React.useState<string>()
  const [phoneNumber, setPhoneNumber] = React.useState<string>()
  const [otp, setOtp] = React.useState<string>()
  const [otpSent, setOtpSent] = React.useState<boolean>(false)

  const signUp = async(username: string, password: string, name: string, phone: string) => {
    try {
      await Auth.signUp({
        username,
        password,
        attributes: {
          name,
          phone_number: `+91${phone}`
        }
      });
      setOtpSent(true)
    } catch (error) {
      notifyMessage(error.message)
    }
  }
  
  const confirmUser = async(username: string, code: string) => {
    try {
      await Auth.confirmSignUp(username, code);
    } catch (error) {
      notifyMessage(error.message)
    }
  }
  
  const signInUser = async(username: string, password: string) => {
    try {
      const user = await Auth.signIn(username, password);
      console.log(user);
    } catch (error) {
      notifyMessage(error.message)
    }
  }

  return (
    <View style={{ backgroundColor: "transparent" }}>
      {!otpSent ? (
        <>
          <Input
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Name" />
          <Input
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Username" />
          <Input
            style={styles.input}
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            placeholder="Password" />
          <Input
            style={styles.input}
            value={phoneNumber}
            keyboardType="numeric"
            onChangeText={setPhoneNumber}
            placeholder="Mobile Number" />
          <TouchableOpacity
            style={styles.button}
            onPress={() => signUp(username, password, name, phoneNumber)}>
            <Text>Signup</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Input
            style={styles.input}
            value={otp}
            onChangeText={setOtp}
            placeholder="OTP" />
          <TouchableOpacity
            style={styles.button}
            onPress={() => confirmUser(username, otp)}>
            <Text>Verify OTP</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

import * as React from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text, View } from '../../components/Themed';
import { notifyMessage, primaryColor } from "../../commonUtils"
import { useSelector } from 'react-redux';
import { Input, Button } from "@ui-kitten/components"
import { Auth } from 'aws-amplify';
import styles from "./styles"
import { useState } from 'react';

export default function ForgotPassword(props) {
  const { showLoginScreen } = props
  const [password, setPassword] = useState<string>()
  const [phoneNumber, setPhoneNumber] = useState<string>()
  const [otp, setOtp] = useState<string>()
  const [otpSent, setOtpSent] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const sendVerification = async () => {
    try {
      setLoading(true)
      await Auth.forgotPassword(phoneNumber)
      notifyMessage("OTP sent to your phone number")
      setOtpSent(true)
      setLoading(false)
    } catch (e) {
      console.log(e)
      notifyMessage(e.message)
    }
  }

  const updatePassword = async () => {
    try {
      setLoading(true)
      await Auth.forgotPasswordSubmit(phoneNumber, otp, password)
      setLoading(false)
      showLoginScreen()
    } catch (e) {
      console.log(e)
      notifyMessage(e.message)
    }
  }
  
  return (
    <View style={{ backgroundColor: "transparent" }}>
      {!otpSent ? (
        <>
          <Input
            style={styles.input}
            value={phoneNumber}
            keyboardType="numeric"
            onChangeText={setPhoneNumber}
            placeholder="Phone Number" />
          <TouchableOpacity
            disabled={loading}
            style={styles.button}
            onPress={sendVerification}>
            {loading && <ActivityIndicator style={{ marginRight: 10 }} />}
            <Text style={{ color: "white" }}>Send Verification Code</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Input
            keyboardType="numeric"
            style={styles.input}
            value={otp}
            onChangeText={setOtp}
            placeholder="OTP" />
          <Input
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="New Password" />
          <TouchableOpacity
            disabled={loading}
            style={styles.button}
            onPress={updatePassword}>
            {loading && <ActivityIndicator style={{ marginRight: 10 }} color="white" />}
            <Text style={{ color: "white" }}>Update Password</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

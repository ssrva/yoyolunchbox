import * as React from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text, View } from '../../components/Themed';
import { notifyMessage, primaryColor } from "../../commonUtils"
import { useSelector } from 'react-redux';
import { Input, Button } from "@ui-kitten/components"
import { Auth } from 'aws-amplify';
import styles from "./styles"
import { useState } from 'react';

export default function SignUp(props) {
  const { signUpSuccess } = props
  const [name, setName] = useState<string>()
  const [username, setUsername] = useState<string>()
  const [password, setPassword] = useState<string>()
  const [phoneNumber, setPhoneNumber] = useState<string>()
  const [otp, setOtp] = useState<string>()
  const [otpSent, setOtpSent] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const signUp = async(name: string, phone: string, password: string) => {
    try {
      setLoading(true)
      await Auth.signUp({
        username: phone.toString(),
        password,
        attributes: {
          name,
          phone_number: `+91${phone}`
        }
      });
      setOtpSent(true)
    } catch (error) {
      notifyMessage(error.message)
    } finally {
      setLoading(false)
    }
  }
  
  const confirmUser = async(phone: string, code: string) => {
    try {
      setLoading(true)
      await Auth.confirmSignUp(phone, code)
      signUpSuccess()
    } catch (error) {
      console.log(error)
      notifyMessage(error.message)
    } finally {
      setLoading(false)
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
            value={phoneNumber}
            keyboardType="numeric"
            onChangeText={setPhoneNumber}
            placeholder="Mobile Number" />
          <Input
            style={styles.input}
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            placeholder="Password" />
          <TouchableOpacity
            disabled={loading}
            style={styles.button}
            onPress={() => signUp(name, phoneNumber, password)}>
            {loading && <ActivityIndicator style={{ marginRight: 10 }} />}
            <Text style={{ color: "white" }}>Register</Text>
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
          <TouchableOpacity
            disabled={loading}
            style={styles.button}
            onPress={() => confirmUser(phoneNumber, otp)}>
            {loading && <ActivityIndicator style={{ marginRight: 10 }} color="white" />}
            <Text style={{ color: "white" }}>Verify OTP</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

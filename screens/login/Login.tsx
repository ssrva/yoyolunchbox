import _ from "lodash"
import * as React from 'react'
import axios from "axios"
import {
  ActivityIndicator,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Text, View } from '../../components/Themed'
import { notifyMessage, primaryColor } from "common/utils"
import { useDispatch, useSelector } from 'react-redux'
import { Input } from "@ui-kitten/components"
import { Auth } from 'aws-amplify'
import { useState } from 'react'
import SignUp from './SignUp'
import styles from "./styles"
import { setUser } from '../../store/actions'
import ForgotPassword from './ForgotPassword'
import * as Sentry from "@sentry/browser"
import * as Amplitude from 'expo-analytics-amplitude';

const USER_NOT_CONFIRMED_EXCEPTION = "UserNotConfirmedException"

export default function Login(props) {
  const { navigation } = props
  const [showSignUp, setShowSignUp] = useState<boolean>(false)
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false)
  const [phone, setPhone] = useState<string>()
  const [password, setPassword] = useState<string>()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState<boolean>(false)
  const [userUnconfirmed, setUserUnconfirmed] = useState<boolean>(false)
  const [otp, setOtp] = useState<string>()

  const login = async(phone: string, password: string, otp: string) => {
    if (_.isNil(phone) || _.isNil(password)) {
      notifyMessage("Please enter phone number and password")
      return;
    }
    try {
      setLoading(true)
      if (!_.isEmpty(otp) && userUnconfirmed) {
        await Auth.confirmSignUp(phone, otp);
      }
      const user = await Auth.signIn(phone, password);
      const jwtToken = user.signInUserSession.idToken.jwtToken
      axios.defaults.headers.common['Authorization'] = jwtToken
      dispatch(setUser({
        user: {
          ...user,
          details: user,
        }
      }))
      await Amplitude.setUserIdAsync(user.username)
    } catch (error) {
      if (error.name == USER_NOT_CONFIRMED_EXCEPTION) {
        setUserUnconfirmed(true)
        await Auth.resendSignUp(phone);
      } else {
        notifyMessage(error.message)
      }
      Sentry.captureException(error)
    } finally {
      setLoading(false)
    }
  }

  const exploreMenu = () => {
    navigation.navigate("Explore")
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView style={styles.background}>
          <View style={styles.topBackground} />
          <Image
            style={styles.cornerBackground}
            source={require("../../static/images/circles-bg.png")} />
          <View style={styles.logoArea}>
            <Image
              style={styles.logo}
              source={require("../../static/images/logo.png")} />
            <Text style={styles.tagline}>
              Good Food, Every Day!
            </Text>
          </View>
          <View style={styles.formArea}>
            {showSignUp ? (
              <SignUp
                signUpSuccess={() => setShowSignUp(false)} />
            ) : (
              <View style={{ backgroundColor: "transparent" }}>
                {showForgotPassword ? (
                  <ForgotPassword
                    showLoginScreen={() => setShowForgotPassword(false)} />
                ) : (
                  <View style={{ backgroundColor: "transparent" }}>
                    <Input
                      style={styles.input}
                      value={phone}
                      keyboardType="numeric"
                      onChangeText={setPhone}
                      placeholder="Phone Number" />
                    <Input
                      style={styles.input}
                      value={password}
                      secureTextEntry
                      onChangeText={setPassword}
                      placeholder="Password" />
                    {userUnconfirmed && (
                      <View style={styles.unConfirmedUserView}>
                        <Text style={{ marginBottom: 15 }}>
                          Please enter the OTP sent to your mobile number below.
                        </Text>
                        <Input
                          style={styles.input}
                          value={otp}
                          keyboardType="numeric"
                          onChangeText={setOtp}
                          placeholder="OTP" />
                      </View>
                    )}
                    <TouchableOpacity
                      disabled={loading}
                      style={styles.button}
                      onPress={() => login(phone, password, otp)}>
                      {loading && <ActivityIndicator style={{ marginRight: 10 }} color="white" />}
                      <Text style={{ color: "white" }}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={loading}
                      style={styles.button}
                      onPress={exploreMenu}>
                      <Text style={{ color: "white" }}>Explore the Menu</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <Text style={styles.link} onPress={() => setShowForgotPassword(!showForgotPassword)}>
                  {!showForgotPassword ? "Forgot Password? Click Here" : "Login Here"}
                </Text>
              </View>
            )}
            {!showForgotPassword && (
              <Text style={styles.link} onPress={() => setShowSignUp(!showSignUp)}>
                {showSignUp ? "Existing User? Login here" : "New User? Sign up here"}
              </Text>
            )}
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
}


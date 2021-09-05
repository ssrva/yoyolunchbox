import * as React from 'react'
import axios from "axios"
import { ActivityIndicator, Keyboard, TouchableOpacity, TouchableWithoutFeedback, Image } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Text, View } from '../../components/Themed'
import { notifyMessage, primaryColor } from "../../commonUtils"
import { useDispatch, useSelector } from 'react-redux'
import { Input } from "@ui-kitten/components"
import { Auth } from 'aws-amplify'
import { useState } from 'react'
import SignUp from './SignUp'
import styles from "./styles"
import { setUser } from '../../store/actions'
import ForgotPassword from './ForgotPassword'


export default function Login() {
  const [showSignUp, setShowSignUp] = useState<boolean>(false)
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false)
  const [phone, setPhone] = useState<string>()
  const [password, setPassword] = useState<string>()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState<boolean>(false)

  const login = async(phone: string, password: string) => {
    try {
      setLoading(true)
      const user = await Auth.signIn(phone, password);
      const jwtToken = user.signInUserSession.idToken.jwtToken
      axios.defaults.headers.common['Authorization'] = jwtToken
      dispatch(setUser({
        user: {
          ...user,
          details: user,
        }
      }))
    } catch (error) {
      notifyMessage(error.message)
    } finally {
      setLoading(false)
    }
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
                    <TouchableOpacity
                      disabled={loading}
                      style={styles.button}
                      onPress={() => login(phone, password)}>
                      {loading && <ActivityIndicator style={{ marginRight: 10 }} color="white" />}
                      <Text style={{ color: "white" }}>Login</Text>
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


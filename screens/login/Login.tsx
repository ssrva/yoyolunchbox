import * as React from 'react';
import { ImageBackground, Keyboard, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Text, View } from '../../components/Themed';
import { notifyMessage, primaryColor } from "../../commonUtils"
import { useDispatch, useSelector } from 'react-redux';
import { Input } from "@ui-kitten/components"
import { Auth } from 'aws-amplify';
import { useState } from 'react';
import SignUp from './SignUp';
import styles from "./styles"
import { setUser } from '../../store/actions'


export default function Login() {
  const [showSignUp, setShowSignUp] = useState<boolean>(false)
  const [username, setUsername] = useState<string>()
  const [password, setPassword] = useState<string>()
  const dispatch = useDispatch()

  const login = async(username: string, password: string) => {
    try {
      const user = await Auth.signIn(username, password);
      console.log(user)
      dispatch(setUser({
        user: {
          ...user,
          details: user,
        }
      }))
    } catch (error) {
      notifyMessage(error.message)
    }
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground
          source={require("../../static/images/background.jpg")}
          style={styles.background}>
          <Text style={styles.title}>
            Welcome to YOYO Lunchbox!
          </Text>
          {showSignUp ? (
            <SignUp />
          ) : (
            <View style={{ backgroundColor: "transparent" }}>
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
              <TouchableOpacity
                style={styles.button}
                onPress={() => login(username, password)}>
                <Text>Login</Text>
              </TouchableOpacity>
            </View>
          )}
          <Text style={styles.link} onPress={() => setShowSignUp(!showSignUp)}>
            {showSignUp ? "Existing User? Login here" : "New User? Sign up here"}
          </Text>
        </ImageBackground>
      </TouchableWithoutFeedback>
    </View>
  );
}


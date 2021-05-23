import * as React from 'react';
import { ImageBackground, Keyboard, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Text, View } from '../../components/Themed';
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner
} from 'expo-firebase-recaptcha';
import firebase from "firebase/app"
import { notifyMessage, primaryColor } from "../../commonUtils"
import { useSelector } from 'react-redux';
import { Input, Button } from "@ui-kitten/components"


export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = React.useState<string>()
  const [otp, setOtp] = React.useState<string>()
  const [verificationId, setVerificationId] = React.useState<string>()
  const recaptchaVerifier = React.useRef(null)
  const firebaseConfig = firebase.apps.length
    ? firebase.app().options
    : undefined

  const handleSendOtp = async () => {
    // The FirebaseRecaptchaVerifierModal ref implements the
    // FirebaseAuthApplicationVerifier interface and can be
    // passed directly to `verifyPhoneNumber`.
    try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider()
      const verificationId = await phoneProvider.verifyPhoneNumber(
        `+91${phoneNumber}`,
        recaptchaVerifier.current
      )
      setVerificationId(verificationId)
      notifyMessage("OTP has been sent to your mobile")
    } catch (err) {
      notifyMessage(err.message)
    }
  }

  const handleVerifyOtp = async () => {
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        otp,
      )
      await firebase.auth().signInWithCredential(credential)
      notifyMessage("Verification Successful")
    } catch (err) {
      notifyMessage(err.message)
    }
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground
          source={require("../../static/images/background.jpg")}
          style={styles.background}>
          {/* <View>
            <Image
              style={{ width: 100, height: 80 }}
              source={require("../../static/images/logo.png")} />
          </View> */}
          <Text style={styles.title}>
            Welcome to YOYO Lunchbox!
          </Text>
          {!verificationId ? (
            <>
              <Input
                style={styles.input}
                value={phoneNumber}
                keyboardType="numeric"
                onChangeText={setPhoneNumber}
                placeholder="Mobile Number" />
              <Button style={styles.button} onPress={handleSendOtp}>
                Send OTP
              </Button>
              <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={firebaseConfig} />
            </>
          ) : (
            <>
              <Input
                style={styles.input}
                value={otp}
                onChangeText={setOtp}
                placeholder="OTP" />
              <Button style={styles.button} onPress={handleVerifyOtp}>
                Verify OTP
              </Button>
            </>
          )}
        </ImageBackground>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: primaryColor,
  },
  background: {
    flex: 1,
    padding: 30,
    paddingTop: 200,
    resizeMode: "cover",
  },
  input: {
    width: "100%",
    marginBottom: 30,
  },
  title: {
    fontSize: 35,
    textAlign: "center",
    fontWeight: "900",
    marginBottom: 30,
    color: "white",
  },
  button: {
    backgroundColor: primaryColor,
    borderColor: primaryColor,
  }
});

import * as React from 'react';
import { Button, Image, StyleSheet, TextInput } from 'react-native';
import { Text, View } from '../../components/Themed';
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner
} from 'expo-firebase-recaptcha';
import firebase from "firebase/app"
import { notifyMessage } from "../../commonUtils"
import { useSelector } from 'react-redux';


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
      <View>
        <Image
          style={{ width: 100, height: 80 }}
          source={require("../../static/images/logo.png")} />
      </View>
      <View style={styles.login}>
        <Text style={styles.title}>
          Welcome to YOYO Lunchbox!
        </Text>
        {!verificationId ? (
          <>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Mobile Number" />
            <Button
              onPress={handleSendOtp}
              title="Send OTP" />
            <FirebaseRecaptchaVerifierModal
              ref={recaptchaVerifier}
              firebaseConfig={firebaseConfig} />
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              value={otp}
              onChangeText={setOtp}
              placeholder="OTP" />
            <Button
              onPress={handleVerifyOtp}
              title="Verify OTP" />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: "2rem",
  },
  input: {
    width: "100%",
    padding: "1rem",
  },
  title: {
    fontSize: "1.8rem",
    textAlign: "center",
    fontWeight: "600",
    marginTop: "3rem",
    marginBottom: "5rem",
  },
  login: {
    flex: 1,
    alignItems: "center",
  }
});

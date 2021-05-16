import * as React from 'react';
import { Image, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Text, View } from '../../components/Themed';

export default function LoginScreen() {
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
        <TextInput
          style={styles.input}
          placeholder="Mobile Number" />
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

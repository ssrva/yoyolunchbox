import * as React from 'react';
import { TouchableWithoutFeedback, View, Text, StyleSheet, Keyboard, ActivityIndicator } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.1)",
    zIndex: 100,
    position: "absolute",
    top: 0,
    left: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  messageContainer: {
    backgroundColor: "white",
    padding: 20,
    marginBottom: 100,
    display: "flex",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 5
  },
  label: {
    fontWeight: "bold",
    fontSize: 18,
  }
})

const Spinner = (props) => {
  const { message, visible } = props
  return visible ? (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <ActivityIndicator style={{ marginRight: 10 }} color="#000" size={25} />
        <Text style={styles.label}>{message}</Text>
      </View>
    </View>
  ) : (
    <></>
  )
}

export default Spinner
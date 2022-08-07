import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, Image, View } from 'react-native';
import { Button } from '@ui-kitten/components';

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  image: {
    width: 175,
    height: 175,
    resizeMode: "contain",
    marginBottom: 50
  },
  header: {
    fontWeight: "bold",
    fontSize: 35,
    marginBottom: 20,
    color: "black"
  },
  description: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 50,
    color: "black"
  }
})

const NetworkErrorScreen = (props) => {
  const { retry } = props

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../static/images/no-internet.png")} />
      <Text style={styles.header}>Oops...</Text>
      <Text style={styles.description}>There is a connection error. Please check your internet connection and try again.</Text>
      <Button style={{ width: 200 }} onPress={retry}>
        <Text style={{ color: "white" }}>Try Again</Text>
      </Button>
    </View>
  )
}

export default NetworkErrorScreen

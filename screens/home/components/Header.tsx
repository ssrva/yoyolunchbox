import * as React from 'react';
import { Button, Image, StyleSheet } from 'react-native';
import { Text, View } from '../../../components/Themed';
import styles from "../styles"

const Header = (props) => {
  const { navigation } = props
  return (
    <View style={styles.headerContainer}>
      <View>
        <Image
          style={{ width: 100, height: 40 }}
          source={require("../../../static/images/logo.png")} />
      </View>
    </View>
  )
}

export default Header

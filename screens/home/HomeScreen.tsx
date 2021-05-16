import * as React from 'react';
import { Button, Image, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import Header from './components/Header';
import styles from "./styles"


const HomeScreen = (props) => {
  const { navigation } = props
  return (
    <View style={styles.mainViewStyle}>
      <Header navigation={navigation} />
    </View>
  );
}

export default HomeScreen

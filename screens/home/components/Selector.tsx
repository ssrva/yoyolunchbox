import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from "../../../commonUtils";
import { Text, View } from '../../../components/Themed';

type TSelectorProps = {
  onChange: Function,
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    alignSelf: "flex-start",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    shadowColor: COLORS.GRAY60,
    borderWidth: 1,
    borderColor: COLORS.GRAY80,
    borderRadius: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3.0,
    elevation: 1,
  },
  selectorButton: {
    padding: 5,
    fontWeight: "600",
  },
  countStyle: {
    color: "black",
    padding: 5,
    fontWeight: "600",
  }
})


const Selector = (props: TSelectorProps) => {
  const { onChange } = props
  const [count, setCount] = useState<number>(0)

  const updateCount = (offset: number) => {
    if (count == 0 && offset < 0) return

    setCount(count + offset)
    onChange(count + offset)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.selectorButton} onPress={() => updateCount(-1)}>
        <Ionicons size={18} name="remove" color="green" />
      </TouchableOpacity>
      <Text style={styles.countStyle}>{count}</Text>
      <TouchableOpacity style={styles.selectorButton} onPress={() => updateCount(1)}>
        <Ionicons size={18} name="add" color="green" />
      </TouchableOpacity>
    </View>
  )
}

export default Selector
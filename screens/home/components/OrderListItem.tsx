import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../../../components/Themed';
import { COLORS } from "../../../commonUtils"
import Selector from "./Selector"
import moment from "moment"

type TOrderListItemProps = {
  name: string,
  date: string,
  description: string,
  price: string,
  quantity: string,
  hideDate: boolean,
  disabled: boolean,
  onChange: Function
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    margin: 20,
    marginTop: 0,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY90,
  },
  metadata: {
    flex: 3,
    marginRight: 10,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
  },
  description: {
    fontWeight: "500",
    marginBottom: 10,
  },
  price: {
    fontWeight: "600",
    fontSize: 16,
    color: COLORS.GRAY40,
  },
  selector: {
    flex: 1,
  },
  totalPrice: {
    fontWeight: "600",
    fontSize: 16,
  },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: "#D4F1CA",
    padding: 5,
    marginBottom: 10,
    fontWeight: "600",
    borderWidth: 1,
    borderColor: "#418134",
    borderRadius: 5,
    fontSize: 10,
    textTransform: "uppercase",
  }
})

const OrderListItem = (props: TOrderListItemProps) => {
  const {
    name,
    date,
    hideDate,
    description,
    quantity,
    price,
    onChange,
    disabled,
  } = props

  const updateCount = (newCount: number) => {
    onChange({
      name: name,
      price: price,
      description: description,
      quantity: newCount
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.metadata}>
        {!hideDate && (
          <Text style={styles.tag}>{moment(date).format("MMMM DD, YYYY")}</Text>
        )}
        <Text style={styles.title}>
          {name}
          {disabled && (
            <Text> x {quantity}</Text>
          )}
        </Text>
        <Text style={styles.description}>{description}</Text>
        {!disabled && (<Text style={styles.price}>Rs. {price}</Text>)}
      </View>
      {disabled ? (
        <View>
          <Text style={styles.totalPrice}>
            Rs. {parseInt(price) * parseInt(quantity)}
          </Text>
        </View>
      ) : (
        <View style={styles.selector}>
          <Selector onChange={updateCount} />
        </View>
      )}
    </View>
  )
}

export default OrderListItem

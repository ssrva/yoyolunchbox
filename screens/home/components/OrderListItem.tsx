import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../../../components/Themed';
import { COLORS } from "../../../commonUtils"
import Selector from "./Selector"
import moment from "moment"

type TOrderListItemProps = {
  id: number,
  title: string,
  type: string,
  date: string,
  description: string,
  price: string,
  quantity: string,
  hideDate: boolean,
  disabled: boolean,
  cancelled: boolean,
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
  tagsContainer: {
    display: "flex",
    flexDirection: "row",
  },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: "#D4F1CA",
    padding: 5,
    marginBottom: 10,
    marginRight: 10,
    fontWeight: "600",
    borderWidth: 1,
    borderColor: "#418134",
    borderRadius: 5,
    fontSize: 10,
    textTransform: "uppercase",
    overflow: "hidden"
  },
  dangerTag: {
    backgroundColor: "#F8D7DA",
    borderColor: "#F5C6CB",
    color: "#721C24"
  }
})

const OrderListItem = (props: TOrderListItemProps) => {
  const {
    id,
    title,
    type,
    date,
    hideDate,
    description,
    quantity,
    price,
    onChange,
    disabled,
    cancelled,
  } = props

  const updateCount = (newCount: number) => {
    onChange({
      id: id,
      type: type,
      title: title,
      price: price,
      description: description,
      quantity: newCount
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.metadata}>
        <View style={styles.tagsContainer}>
          {!hideDate && (
            <Text style={styles.tag}>
              {moment(date).format("MMMM DD, YYYY")}
            </Text>
          )}
          {cancelled && (
            <Text style={{...styles.tag, ...styles.dangerTag}}>
              CANCELLED
            </Text>
          )}
        </View>
        <Text style={styles.title}>
          {title}
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

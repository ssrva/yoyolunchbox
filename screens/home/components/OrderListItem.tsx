import * as React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Text, View } from '../../../components/Themed';
import { COLORS } from "../../../commonUtils"
import Selector from "./Selector"
import moment from "moment"
import * as api from "../../../api"
import { useEffect, useState } from 'react';

type TOrderListItemProps = {
  id: number,
  title: string,
  type: string,
  date: string,
  image: string,
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
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.GRAY90,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 5,
    padding: 15
  },
  metadata: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
    resizeMode: "cover",
  },
  description: {
    fontWeight: "500",
    marginBottom: 10,
    lineHeight: 20,
  },
  price: {
    fontWeight: "600",
    fontSize: 16,
    color: COLORS.GRAY40,
  },
  selector: {
    marginTop: 20,
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
    image,
    hideDate,
    description,
    quantity,
    price,
    onChange,
    disabled,
    cancelled,
  } = props

  const [imageBase64, setImageBase64] = useState<string>();

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

  useEffect(() => {
    const getImage = async () => {
      const data = await api.getFoodimage(image)
      setImageBase64(data)
    }
    getImage()
  }, [])

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
        {!disabled && (
          <>
            <Text style={styles.price}>Rs. {price}</Text>
            <View style={styles.selector} >
              <Selector onChange={updateCount} />
            </View>
          </>
        )}
      </View>
      {disabled ? (
        <View>
          <Text style={styles.totalPrice}>
            Rs. {parseInt(price) * parseInt(quantity)}
          </Text>
        </View>
      ) : (
        <View>
          <Image
            style={styles.image}
            source={{uri: `data:image/jpg;base64,${imageBase64}`}}/>
        </View>
      )}
    </View>
  )
}

export default OrderListItem

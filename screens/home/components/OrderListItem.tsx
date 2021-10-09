import _ from "lodash"
import * as React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Text, View } from '../../../components/Themed';
import {
  COLORS,
  getItemFromAsyncStorage,
  putItemInAsyncStorage
} from "../../../commonUtils"
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
  status: string,
  onChange: Function,
  grayOut: boolean,
  grayOutDescription: string,
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
    padding: 15,
    backgroundColor: "white"
  },
  metadata: {
    backgroundColor: "white",
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 15,
    color: "black"
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
    resizeMode: "cover",
  },
  description: {
    color: "black",
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
    backgroundColor: "white",
    marginTop: 20,
  },
  totalPrice: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  tagsContainer: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
  },
  tag: {
    color: "black",
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
  },
  grayOutDescription: {
    borderWidth: 1,
    borderColor: "#D1D1D1",
    borderRadius: 5,
    marginTop: 5,
    padding: 5,
  },
  grayOutDescriptionText: {
    textTransform: "uppercase",
    color: "#555555",
    textAlign: "center"
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
    status,
    grayOut,
    grayOutDescription,
  } = props

  const [imageBase64, setImageBase64] = useState<string>();

  const updateCount = (newCount: number) => {
    onChange({
      id: id,
      type: type,
      title: title,
      date: date,
      price: price,
      image: image,
      description: description,
      quantity: newCount,
      status: status
    })
  }

  useEffect(() => {
    const getImage = async () => {
      let data = await getItemFromAsyncStorage(image)
      if(_.isNil(data)) {
        data = await api.getFoodimage(image)
        await putItemInAsyncStorage(image, data)
      }
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
          {status === "cancelled" && (
            <Text style={{...styles.tag, ...styles.dangerTag}}>
              CANCELLED
            </Text>
          )}
        </View>
        <Text style={styles.title}>
          {title}
          {disabled && (
            <Text style={{ color: "black" }}> x {quantity}</Text>
          )}
        </Text>
        {disabled && (
          <Text style={styles.totalPrice}>
            Rs. {parseInt(price) * parseInt(quantity)}
          </Text>
        )}
        <Text style={styles.description}>{description}</Text>
        {grayOut && (
          <View style={styles.grayOutDescription}>
            <Text style={styles.grayOutDescriptionText}>{grayOutDescription}</Text>
          </View>
        )}
        {(!disabled && !grayOut) && (
          <>
            <Text style={styles.price}>Rs. {price}</Text>
            <View style={styles.selector} >
              <Selector onChange={updateCount} />
            </View>
          </>
        )}
      </View>
      {!_.isNil(imageBase64) && (
        <View style={{ backgroundColor: "white" }}>
          {grayOut && (
            <View style={{
              width: 100,
              height: 100,
              position: "absolute",
              backgroundColor: "#555555",
              zIndex: 100,
              borderRadius: 5,
              opacity: 0.5
            }} />
          )}
          <Image
            style={styles.image}
            source={{uri: `data:image/jpg;base64,${imageBase64}`}}/>
        </View>
      )}
    </View>
  )
}

export default OrderListItem

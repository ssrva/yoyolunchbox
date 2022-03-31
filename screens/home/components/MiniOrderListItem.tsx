import _ from "lodash"
import * as React from 'react';
import { StyleSheet, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Text, View } from '../../../components/Themed';
import { COLORS, notifyMessage, getItemFromAsyncStorage, putItemInAsyncStorage } from "common/utils"
import Selector from "./Selector"
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Button } from "@ui-kitten/components";
import Constants from "yoyoconstants/Constants"
import * as api from "api"
import * as Amplitude from 'expo-analytics-amplitude';
import { TOrderListItemProps } from "common/types"
import * as Sentry from "@sentry/browser"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.GRAY90,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: 200,
    borderRadius: 10,
    backgroundColor: "white",
    overflow: "hidden"
  },
  metadata: {
    backgroundColor: "white",
    flex: 1,
    margin: 10,
  },
  title: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 15,
    color: "black"
  },
  image: {
    width: "100%",
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: "cover",
    overflow: "hidden"
  },
  price: {
    fontWeight: "600",
    fontSize: 16,
    color: COLORS.GRAY40,
  },
  selector: {
    backgroundColor: "white",
  },
  totalPrice: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  horizontal: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white"
  }
})

const MiniOrderListItem = (props: TOrderListItemProps) => {
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
    onCancel,
    disabled,
    cancellable,
    status,
    grayOut,
    grayOutDescription,
    source
  } = props

  const dispatch = useDispatch()
  const username = useSelector(store => store.user.username)
  const [imageBase64, setImageBase64] = useState<string>();
  const [cancelling, setCancelling] = useState<boolean>(false);

  const updateCount = (newCount: number, increase: boolean) => {
    trackUpdateCount(newCount, increase)
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

  const trackUpdateCount = async (newCount: number, increase: boolean) => {
    const eventName = increase ? "ITEM_ADD" : "ITEM_REMOVE"
    Amplitude.logEventWithPropertiesAsync(eventName, {
      source: source,
      updatedQuantity: newCount,
      itemName: title,
      date: date
    })
  }

  useEffect(() => {
    const getImage = async () => {
      let data = await getItemFromAsyncStorage(image)
      if(_.isNil(data)) {
        try {
          let data = await api.getFoodimage(image.trim())
          if (!_.isNil(data)) {
            await putItemInAsyncStorage(image, data)
            setImageBase64(data)
          }
        } catch (e) {
          console.log(image)
          console.log("Error fetching/storing image " + e)
          Sentry.captureException(e)
        }
      } else {
        setImageBase64(data)
      } 
    }
    getImage()
  }, [])


  return (
    <View style={styles.container}>
      {!_.isNil(imageBase64) && (
        <View style={{ backgroundColor: "white" }}>
          <Image
            style={styles.image}
            source={{uri: `data:image/jpg;base64,${imageBase64}`}}/>
        </View>
      )}
      <View style={styles.metadata}>
        <Text numberOfLines={1} style={styles.title} ellipsizeMode="tail">
          {title}
        </Text>
        <View style={styles.horizontal}>
          <Text style={styles.price}>{'\u20B9'} {price}</Text>
          <Button
            onPress={() => updateCount(1, true)}
            size="small"
            status="warning"
            appearance="outline">
            ADD
          </Button>
        </View>
      </View>
    </View>
  )
}

export default MiniOrderListItem

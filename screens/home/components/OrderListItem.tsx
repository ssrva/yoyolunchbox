import _ from "lodash"
import * as React from 'react';
import { StyleSheet, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Text, View } from '../../../components/Themed';
import { COLORS, notifyMessage, getItemFromAsyncStorage, putItemInAsyncStorage } from "common/utils"
import Selector from "./Selector"
import moment from "moment"
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Button } from "@ui-kitten/components";
import Constants from "yoyoconstants/Constants"
import * as api from "api"
import { refreshBalance } from "store/actions"
import * as Amplitude from 'expo-analytics-amplitude';
import { TOrderListItemProps } from "common/types"
import * as Sentry from "@sentry/browser"

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
    marginBottom: 10
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
    borderColor: "#721C24",
    borderWidth: 1,
    color: "#721C24"
  },
  grayOutDescription: {
    backgroundColor: "white",
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


  /**
   * The user can cancel the order anytime before the date of delivery. We allow cancellation
   * only before the cutoff hours on date of delivery.
   * @returns boolean
   */
  const canCancelOrder = () => {
    if (!cancellable) {
      return false;
    }
    const today = moment().utcOffset("530").format("YYYY-MM-DD");
    const currentHour = parseInt(moment().utcOffset("530").format("HH"));
    if (today == date) {
      const cutoffHour = type == Constants.lunch
        ? Constants.lunchCutoffHour : Constants.dinnerCutoffHour;
      return currentHour < cutoffHour;
    } else if (today > date) {
      return false;
    }
    return true;
  }

  /**
   * This method MUST be called only after checking canCancelOrder.
   */
  const cancelOrder = async (orderId: number, username: string) => {
    try {
      setCancelling(true)
      await api.cancelOrder(orderId, username)
      Amplitude.logEventWithPropertiesAsync("CANCEL_ORDER", {
        orderId: orderId,
        name: title,
        amount: price
      })
      dispatch(refreshBalance())
      onCancel()
      notifyMessage("Order cancelled")
    } catch (error) {
      notifyMessage("Failed to cancel order, please reach out to us on whatsapp")
    } finally {
      setCancelling(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.metadata}>
        <View style={styles.tagsContainer}>
          {!hideDate && (
            <Text style={styles.tag}>
              {moment(date).format("MMMM DD, YYYY")} ({type})
            </Text>
          )}
        </View>
        {status === "cancelled" && (
          <View style={styles.tagsContainer}>
              <Text style={{...styles.tag, ...styles.dangerTag}}>
                CANCELLED
              </Text>
          </View>
        )}
        <Text style={styles.title}>
          {title}
          {disabled && (
            <Text style={{ color: "black" }}> x {quantity}</Text>
          )}
        </Text>
        {disabled && (
          <Text style={styles.totalPrice}>
            {'\u20B9'} {parseInt(price) * parseInt(quantity)}
          </Text>
        )}
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.price}>{'\u20B9'} {price}</Text>
        {grayOut && !_.isNil(grayOutDescription) && (
          <View style={styles.grayOutDescription}>
            <Text style={styles.grayOutDescriptionText}>{grayOutDescription}</Text>
          </View>
        )}
        {(!disabled && !grayOut) && (
          <>
            <View style={styles.selector} >
              <Selector count={quantity} onChange={updateCount} />
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
          {canCancelOrder() && (
            <Button status='danger'
              accessoryLeft={CancelIcon}
              size={"small"}
              disabled={cancelling}
              onPress={() => cancelOrder(id, username)}>
              Cancel
            </Button>
          )}
        </View>
      )}
    </View>
  )
}

const CancelIcon = () => (
  <Ionicons name='close-circle' size={18} color={"white"}/>
);

export default OrderListItem

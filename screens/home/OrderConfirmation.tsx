import * as React from 'react';
import _ from "lodash"
import moment from "moment"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ActivityIndicator, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { refreshBalance } from 'store/actions';
import { Text, View } from '../../components/Themed'
import commonStyles from "./styles"
import ConnectedOrderListItem from './components/ConnectedOrderListItem'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { COLORS, notifyMessage } from "common/utils"
import { Button, Input } from "@ui-kitten/components"
import * as api from "../../api"
import { useState } from 'react'
import Constants from 'yoyoconstants/Constants';
import * as Sentry from "@sentry/browser"
import * as Amplitude from "expo-analytics-amplitude"
import ConnectedMiniOrderListItem from './components/ConnectedMiniOrderListItem';
import { TSubscription } from 'common/types';

type TOrderConfirmationProps = {
  route: Object,
  navigation: any
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    display: "flex",
    paddingTop: 0
  },
  title: {
    color: "black",
    marginBottom: 0,
    fontWeight: "bold",
    fontSize: 18,
    backgroundColor: "white",
  },
  subtitle: {
    color: "black",
    marginTop: 10,
    marginBottom: 10,
    fontWeight: "normal",
    fontSize: 15,
    backgroundColor: "transparent",
    textTransform: "uppercase"
  },
  billDetailsContainer: {
    backgroundColor: "white",
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
  billTitle: {
    color: "black",
    fontSize: 15,
    textTransform: "uppercase",
    paddingBottom: 5,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: "#D1D1D1"
  },
  tableContainer: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column"
  },
  tableRow: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 10,
  },
  lastRow: {
    marginTop: 5,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#D1D1D1"
  },
  warningText: {
    color: "red",
    fontStyle: "italic",
    marginBottom: 10
  },
  instructions: {
    marginBottom: 10
  },
  section: {
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: "#FFFFFF"
  },
  alternateSection: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#F7F7F7"
  },
  subscriptionIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain"
  },
  messageBox: {
    backgroundColor: "#D4F1CA",
    padding: 10,
    marginBottom: 10,
    borderColor: "#418134",
    borderRadius: 5,
  },
  link: {
    fontWeight: "bold",
    color: "#0072C5",
    textDecorationLine: "underline"
  }
})

const OrderConfirmation = (props: TOrderConfirmationProps) => {
  const { route, navigation } = props
  const [loading, setLoading] = useState<boolean>(false)
  const [pageLoading, setPageLoading] = useState<boolean>(false)
  const [showAddon, setShowAddon] = useState<boolean>(false)
  const [remarks, setRemarks] = useState<string>("")
  const [subscription, setSubscription] = useState<TSubscription>({ active: false })
  const username = useSelector(store => store.user.username)
  const cart = useSelector(store => store.cart)
  const orders = _.values(cart)
  const deliveryCharge = 40

  const balance = useSelector(store => store.balance)
  let itemTotalPrice = orders.reduce((acc, order) => {
    return acc + (order.price * order.quantity)
  }, 0)
  let totalOrderPrice = itemTotalPrice
  if (!subscription.active) {
    totalOrderPrice = itemTotalPrice + deliveryCharge;
  }
  const hasSufficientBalance = totalOrderPrice <= balance
  const dispatch = useDispatch();
  const menu = useSelector(store => store.menu)
  const uniqueDatesInOrder = _.uniq(orders.map(o => o.date)).length
  const uniqueMenuTypeInOrder = _.uniq(orders.map(o => o.type)).length

  React.useEffect(() => {
    const init = async () => {
      setPageLoading(true)
      const subscriptionDetails = await api.getSubscription(username)
      setSubscription(subscriptionDetails)
      setPageLoading(false)
    }
    init()
  }, [])

  const getAddonsToShow = () => {
    if (uniqueDatesInOrder != 1 || uniqueMenuTypeInOrder != 1) {
      return [];
    }
    if (orders && orders[0]) {
      const date = orders[0].date
      const menuType = orders[0].type
      const existingItems = orders.map(o => o.id)
      return _.filter(menu[date], (menuItem) => {
        return !existingItems.includes(menuItem.id) &&
          menuItem.type == menuType &&
          menuItem.addon 
      })
    }
    return []
  }

  const confirmOrder = async () => {
    const apiInput = orders.map(order => {
      return {
        menu_id: order.id,
        quantity: order.quantity,
        amount: order.quantity * order.price,
        remarks: remarks,
      }
    })

    try {
      const currentDate = await api.getCurrentTime();
      if (currentDate) {
        const time = moment(currentDate.datetime);
        const date = time.format("YYYY-MM-DD");
        const hour = parseInt(time.format("HH"));
        let invalidOrder = false;
        orders.forEach(order => {
          if (order.date == date) {
            if ((order.type == Constants.dinner && hour > Constants.dinnerCutoffHour)
                || (order.type == Constants.lunch && hour > Constants.lunchCutoffHour)
                || (order.type == Constants.breakfast && hour > Constants.breakfastCutoffHour)) {
                invalidOrder = true;
            }
          }
        });
        if (invalidOrder) {
          const message = `Orders should be placed before 6AM for Brunch, 9AM for Lunch and 4PM for Dinner`;
          notifyMessage(message)
          return;
        }
      }
    } catch (e) {
      Sentry.captureException(e)
    }

    const charges = {
      delivery: subscription.active ? 0 : deliveryCharge,
      // packing: 6,
    }

    setLoading(true)
    try {
      const address = await api.getAddress(username) || []
      if (address.length == 0) {
        notifyMessage("Please add address from profile page before ordering")
      } else {
        await api.placeOrder(username, charges, apiInput, subscription.id)
        trackOrderInfo(orders)
        notifyMessage("Order placed successfully")
        dispatch(refreshBalance())
        navigation.navigate("Home")
      }
    } catch (e) {
      notifyMessage("Error placing order")
    } finally {
      setLoading(false)
    }
  }

  const trackOrderInfo = async (orderData) => {
    const orderTypes = _.uniq(orderData.map(o => o.type))
    const orderAmount = _.sum(orderData.map(o => parseInt(o.price)))
    const itemCount = orderData.length
    const trackingInfo = {
      uniqueDatesInOrder: uniqueDatesInOrder,
      menuTypes: orderTypes,
      itemCount: itemCount,
      orderAmount: orderAmount
    }
    Amplitude.logEventWithPropertiesAsync("PLACE_ORDER", trackingInfo)
  }

  const getImage = () => {
    if (subscription.plan == "Bronze") {
      return (
        <Image
          style={styles.subscriptionIcon}
          source={require(`../../static/images/bronze.png`)} />
      )
    }
    if (subscription.plan == "Silver") {
      return (
        <Image
          style={styles.subscriptionIcon}
          source={require(`../../static/images/silver.png`)} />
      )
    }
    if (subscription.plan == "Gold") {
      return (
        <Image
          style={styles.subscriptionIcon}
          source={require(`../../static/images/gold.png`)} />
      )
    }
    return <></>
  }

  return (
    <View style={styles.container}>
      {pageLoading ? (
        <View style={{ backgroundColor: "white" }}>
          <ActivityIndicator color={"black"} />
        </View>
      ) : (
        <>
          <KeyboardAwareScrollView style={{ backgroundColor: "white" }}>
            <View style={styles.section}>
              <Text style={styles.title}>Order Summary</Text>
              <FlatList
                data={orders}
                renderItem={({item}) => {
                  return (
                    <ConnectedOrderListItem
                      source="ORDER_CONFIRMATION_PAGE"
                      {...item} />
                  )
                }}
              />
            </View>
            
            {getAddonsToShow().length > 0 && (
              <View style={{ ...styles.section, ...styles.alternateSection }}>
                <Text style={styles.subtitle}>Complete your meal with addons</Text>
                <FlatList
                  horizontal
                  data={getAddonsToShow()}
                  ItemSeparatorComponent={
                    () => <View style={{ width: 15, backgroundColor: "transparent" }}/>
                  }
                  renderItem={({item}) => {
                    return (
                      <ConnectedMiniOrderListItem
                        key={item.name}
                        hideDate
                        source="ADDON_CONFIRMATION_PAGE" // this is used for amplitude tracking info
                        {...item} />
                    )
                  }}
                />
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.subtitle}>Got any instructions?</Text>
              <Input
                value={remarks}
                multiline
                style={styles.instructions}
                placeholder="Any instructions?"
                numberOfLines={4}
                onChangeText={setRemarks} />
            </View>

            <View style={styles.section}>
              <Text style={styles.subtitle}>Bill Details</Text>
              <View style={styles.billDetailsContainer}>
                <View style={styles.tableContainer}>
                  <View style={styles.tableRow}>
                    <Text style={{ fontWeight: "bold", color: "black" }}>Item Total</Text>
                    <Text style={{ color: "black" }}>{'\u20B9'}{itemTotalPrice}</Text>
                  </View>
                  {/* <View style={styles.tableRow}>
                    <Text style={{ fontWeight: "bold" }}>Packing charges</Text>
                    <Text>{'\u20B9'}6</Text>
                  </View> */}
                  <View style={styles.tableRow}>
                    <Text style={{ fontWeight: "bold", color: "black" }}>Delivery charges</Text>
                    {subscription.active ? (
                      <View style={{ display: "flex", flexDirection: "row", backgroundColor: "white", justifyContent: "center"}}>
                        <Text style={{ color: "green", marginRight: 5, textDecorationLine: "line-through" }}>{'\u20B9'}40</Text>
                        <Text style={{ color: "green" }}>0</Text>
                      </View>
                    ) : (
                      <Text style={{ color: "black" }}>{'\u20B9'}40</Text>
                    )}
                  </View>
                  <View style={styles.tableRow}>
                    {subscription.active && (
                      <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", backgroundColor: "white"}}>
                        <Text style={{ color: "green" }}>Wohoo! Your </Text>
                        {getImage()}
                        <Text style={{ color: "green" }}> plan just saved you {'\u20B9'}40!</Text>
                      </View>
                    )}
                  </View>
                  {!subscription.active && (
                    <View style={styles.messageBox}>
                      <Text style={{ color: "green", flex: 1, lineHeight: 25 }}>
                        Psst! You can save on your delivery charges with our awesome subscription plans! <Text style={styles.link} onPress={() => {
                          Amplitude.logEventAsync("SUBSCRIPTION_KNOW_MORE_CLICKED")
                          navigation.navigate("Subscriptions")
                        }}>Click here to know more.</Text>
                      </Text>
                    </View>
                  )}
                  <View style={{...styles.tableRow, ...styles.lastRow}}>
                    <Text style={{ fontWeight: "bold", color: "black" }}>Total</Text>
                    <Text style={{ color: "black" }}>{'\u20B9'}{totalOrderPrice}</Text>
                  </View>
                </View>
              </View>
            </View>

          </KeyboardAwareScrollView>
          <View style={{ ...styles.section, paddingTop: 15, paddingBottom: 15 }}>
            <View style={commonStyles.footer}>
              {!hasSufficientBalance && (
                <View style={{ backgroundColor: "white" }}>
                  <Text style={styles.warningText}>
                    Your balance is insufficient to place this order. <Text style={styles.link} onPress={() => {
                      Amplitude.logEventAsync("ADD_MONEY_THROUGH_ORDER_CONFIRMATION_CLICKED")
                      navigation.navigate("Add Money")
                    }}>Click here to recharge your wallet.</Text>
                  </Text>
                </View>
              )}
              <TouchableOpacity
                disabled={loading || !hasSufficientBalance}
                style={commonStyles.mainButton}
                onPress={confirmOrder}>
                {loading && (<ActivityIndicator style={{ marginRight: 10 }} color="white" />)}
                <Text style={{ color: "white" }}>Confirm Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  )
}

export default OrderConfirmation

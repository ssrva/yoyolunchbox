import * as React from 'react';
import _ from "lodash"
import { useState } from 'react';
import { SectionList, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { Text, View } from '../../components/Themed';
import styles from "./styles"
import moment from "moment"
import OrderListItem from './components/OrderListItem';
import { Ionicons } from '@expo/vector-icons';
import { Button } from "@ui-kitten/components"
import DateComponent from './components/DateComponent';

const HomeScreen = (props) => {
  const { navigation } = props
  const menu = useSelector(store => store.menu)
  const user = useSelector(store => store.user.attributes)
  // const [selectedDate, setSelectedDate] = useState<string>(moment().format("YYYY-MM-DD"))
  const [selectedDate, setSelectedDate] = useState<string>("2021-07-27")
  const [orders, setOrders] = useState<Object>({})
  const selectedMenu = (menu && _.groupBy(menu[selectedDate], "type")) || {}

  const menuData = () => {
    const result = []
    if (_.isNil(selectedMenu) || _.isEmpty(selectedMenu)) return []

    result.push({
      title: "Breakfast", data: selectedMenu["breakfast"] || []
    })
    result.push({
      title: "Lunch", data: selectedMenu["lunch"] || []
    })
    result.push({
      title: "Dinner", data: selectedMenu["dinner"] || []
    })
    return result
  }

  const updateOrder = (order) => {
    const currentOrders = orders
    currentOrders[order.id] = order
    setOrders(currentOrders)
  }

  const placeOrder = () => {
    navigation.navigate("Confirm Order", {
      orders: _.values(orders)
    })
  }

  return (
    <View style={styles.mainViewStyle}>
      <View style={styles.ordersPageMainView}>
        <View>
          <Text style={styles.headerWelcome}>
            <Text style={{ fontFamily: "helvetica-neue" }}>Welcome </Text>
            <Text style={{ fontFamily: "helvetica-neue-bold" }}>{user?.name}!</Text>
          </Text>
          <Text style={styles.headerWelcome}>
            <Text style={{ fontFamily: "helvetica-neue-light" }}>What would you like to order?</Text>
          </Text>
        </View>
        <DateComponent onDateChange={setSelectedDate} />
        <View style={styles.ordersContainer}>
          {(_.isNil(selectedMenu) || _.isEmpty(selectedMenu)) ? (
            <Text style={{ padding: 20 }}>
              Menu not yet available for this date :(
            </Text>
          ) : (
            <>
              <SectionList
                stickySectionHeadersEnabled={true}
                sections={menuData()}
                renderItem={({item}) => {
                  return (
                    <OrderListItem
                      key={item.name}
                      hideDate
                      onChange={updateOrder}
                      {...item} />
                  )
                }}
                renderSectionHeader={({section}) => {
                  return (
                    <Text style={styles.sectionHeader}>{section.title}</Text>
                  )
                }}
              />
              <View style={styles.footer}>
                <TouchableOpacity style={styles.mainButton} onPress={placeOrder}>
                  <Text style={{ color: "white" }}>Place Order</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

export default HomeScreen

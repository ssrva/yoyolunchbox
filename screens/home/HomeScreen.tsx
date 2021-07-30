import * as React from 'react';
import _ from "lodash"
import { useState } from 'react';
import { SectionList, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { Text, View } from '../../components/Themed';
import Header from './components/Header';
import styles from "./styles"
import moment from "moment"
import OrderListItem from './components/OrderListItem';
import { Ionicons } from '@expo/vector-icons';
import { Button } from "@ui-kitten/components"


const HomeScreen = (props) => {
  const { navigation } = props
  const menu = useSelector(store => store.menu)
  // const [selectedDate, setSelectedDate] = useState<string>(moment().format("YYYY-MM-DD"))
  const [selectedDate, setSelectedDate] = useState<string>("2021-07-27")
  const [orders, setOrders] = useState<Object>({})
  const selectedMenu = (menu && _.groupBy(menu[selectedDate], "type")) || {}

  const gotoDate = (offset: number) => {
    const toDate = moment(selectedDate).add(offset, "days")
    setSelectedDate(toDate.format("YYYY-MM-DD"))
  }

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
      orders: _.values(orders),
      date: selectedDate,
    })
  }

  return (
    <View style={styles.mainViewStyle}>
      <View style={styles.ordersPageMainView}>
        <View style={styles.dateContainer}>
          <TouchableOpacity style={styles.button} onPress={() => gotoDate(-1)}>
            <Ionicons size={18} name="chevron-back-outline" />
          </TouchableOpacity>
          <Text style={{ fontWeight: "600" }}>
            {moment(selectedDate).format("MMMM Do YY")}
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => gotoDate(1)}>
            <Ionicons size={18} name="chevron-forward-outline" />
          </TouchableOpacity>
        </View>
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
                <Button style={styles.mainButton} onPress={placeOrder}>
                  Place Order
                </Button>
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

export default HomeScreen

import * as React from 'react';
import _ from "lodash"
import { useState } from 'react';
import { SectionList, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Text, View } from '../../components/Themed';
import styles from "./styles"
import moment from "moment"
import OrderListItem from './components/OrderListItem';
import DateComponent from './components/DateComponent';
import { setMenu } from "../../store/actions"
import * as api from "../../api"
import { useEffect } from 'react';

const HomeScreen = (props) => {
  const { navigation } = props
  const dispatch = useDispatch()
  const menu = useSelector(store => store.menu)
  const user = useSelector(store => store.user.attributes)
  const today = moment().utcOffset("530").format("YYYY-MM-DD")
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState<string>(moment().format("YYYY-MM-DD"))
  // const [selectedDate, setSelectedDate] = useState<string>("2021-07-27")
  const [orders, setOrders] = useState<Object>({})
  const selectedMenu = (menu && _.groupBy(menu[selectedDate], "type")) || {}

  const fetchMenuDetails = async () => {
    const datesToFetch = []
    setLoading(true)
    for(let i = 0; i < 3; i++) {
      datesToFetch.push(moment(today).add(i, 'd').format("YYYY-MM-DD"))
    }
    let menu = await api.getMenu(datesToFetch)
    menu = _.groupBy(menu, "date")
    dispatch(setMenu({ menu: menu }))
    setLoading(false)
  }

  const menuData = () => {
    const result = []
    if (_.isNil(selectedMenu) || _.isEmpty(selectedMenu)) return []
    const currentHour = parseInt(moment().format("HH"))

    result.push({
      title: "Lunch",
      data: selectedMenu["lunch"] || [],
      grayOut: selectedDate === today && currentHour >= 9,
      grayOutDescription: "Order before 9AM"
    })
    result.push({
      title: "Dinner",
      data: selectedMenu["dinner"] || [],
      grayOut: selectedDate === today && currentHour >= 16,
      grayOutDescription: "Order before 4PM"
    })
    return result
  }

  const updateOrder = (order) => {
    const currentOrders = _.clone(orders)
    if(order.quantity == 0) {
      delete currentOrders[order.id]
    } else {
      currentOrders[order.id] = order
    }
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
                onRefresh={fetchMenuDetails}
                refreshing={loading}
                stickySectionHeadersEnabled={true}
                sections={menuData()}
                renderItem={({item, index, section}) => {
                  return (
                    <OrderListItem
                      key={item.name}
                      hideDate
                      onChange={updateOrder}
                      grayOut={section.grayOut}
                      grayOutDescription={section.grayOutDescription}
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
                <TouchableOpacity
                  disabled={Object.keys(orders).length == 0}
                  style={styles.mainButton}
                  onPress={placeOrder}>
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

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
import Constants from "yoyoconstants/Constants"


const getInitialDate = () => {
  const today = moment().utcOffset("530").format("YYYY-MM-DD")
  const currentHour = parseInt(moment().utcOffset("530").format("HH"))
  if (currentHour >= Constants.dinnerCutoffHour) {
    const tomorrow = moment(today).add(1, "day").format("YYYY-MM-DD")
    return tomorrow
  }
  return today
}

const HomeScreen = (props) => {
  const { navigation } = props
  const dispatch = useDispatch()
  const menu = useSelector(store => store.menu)
  const username = useSelector(store => store.user.username)
  const user = useSelector(store => store.user.attributes)
  const today = moment().utcOffset("530").format("YYYY-MM-DD")
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState<string>(getInitialDate())
  const [orders, setOrders] = useState<Object>({})
  const selectedMenu = (menu && _.groupBy(menu[selectedDate], "type")) || {}

  const fetchMenuDetails = async () => {
    const datesToFetch = []
    setLoading(true)
    for(let i = 0; i < 7; i++) {
      datesToFetch.push(moment(today).add(i, 'd').format("YYYY-MM-DD"))
    }
    let menu = await api.getMenu(datesToFetch, username)
    menu = _.groupBy(menu, "date")
    dispatch(setMenu({ menu: menu }))
    setLoading(false)
  }

  const menuData = () => {
    const result = []
    if (_.isNil(selectedMenu) || _.isEmpty(selectedMenu)) return []
    const currentHour = parseInt(moment().utcOffset("530").format("HH"))

    if (selectedMenu["breakfast"] && selectedMenu["breakfast"].length > 0) {
      result.push({
        title: "Brunch",
        data: selectedMenu["breakfast"] || [],
        grayOut: selectedDate === today && currentHour >= Constants.lunchCutoffHour,
        grayOutDescription: "Order before 6AM"
      })
    }
    if (selectedMenu["lunch"] && selectedMenu["lunch"].length > 0) {
      result.push({
        title: "Lunch",
        data: selectedMenu["lunch"] || [],
        grayOut: selectedDate === today && currentHour >= Constants.lunchCutoffHour,
        grayOutDescription: "Order before 9AM"
      })
    }
    if (selectedMenu["dinner"] && selectedMenu["dinner"].length > 0) {
      result.push({
        title: "Dinner",
        data: selectedMenu["dinner"] || [],
        grayOut: selectedDate === today && currentHour >= Constants.dinnerCutoffHour,
        grayOutDescription: "Order before 4PM"
      })
    }
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
        <View style={{ backgroundColor: "white" }}>
          <Text style={styles.headerWelcome}>
            <Text style={{ fontFamily: "helvetica-neue", color: "black" }}>Welcome </Text>
            <Text style={{ fontFamily: "helvetica-neue-bold", color: "black" }}>{user?.name}!</Text>
          </Text>
          <Text style={styles.headerWelcome}>
            <Text style={{ fontFamily: "helvetica-neue-light", color: "black" }}>What would you like to order?</Text>
          </Text>
        </View>
        <DateComponent initialDate={selectedDate} onDateChange={setSelectedDate} />
        <View style={styles.ordersContainer}>
          {(_.isNil(selectedMenu) || _.isEmpty(selectedMenu)) ? (
            <Text style={{ padding: 20, color: "black" }}>
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
                      source="MENU_PAGE" // this is used for amplitude tracking info
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

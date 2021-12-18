import * as React from 'react';
import _ from "lodash"
import { useState } from 'react';
import { SectionList, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Text, View } from '../../../../components/Themed';
import styles from "../../styles"
import moment from "moment"
import OrderListItem from '../../components/OrderListItem';
import DateComponent from '../../components/DateComponent';
import { setMenu } from "../../../../store/actions"
import * as api from "../../../../api"

const exploreStyles = StyleSheet.create({
  mainView: {
    paddingTop: 20
  }
})

// Read-only version of HomeScreen
const ExploreMenu = (props) => {
  const { navigation } = props
  const dispatch = useDispatch()
  const menu = useSelector(store => store.menu)
  const today = moment().utcOffset("530").format("YYYY-MM-DD")
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState<string>(moment().format("YYYY-MM-DD"))
  const [orders, setOrders] = useState<Object>({})
  const selectedMenu = (menu && _.groupBy(menu[selectedDate], "type")) || {}
  
  const fetchMenuDetails = async () => {
    const datesToFetch = []
    setLoading(true)
    for(let i = 0; i < 7; i++) {
      datesToFetch.push(moment(today).add(i, 'd').format("YYYY-MM-DD"))
    }
    let menu = await api.getMenu(datesToFetch)
    menu = _.groupBy(menu, "date")
    dispatch(setMenu({ menu: menu }))
    setLoading(false)
  }

  React.useEffect(() => {
    fetchMenuDetails()
  }, [])

  const menuData = () => {
    const result = []
    if (_.isNil(selectedMenu) || _.isEmpty(selectedMenu)) return []
    result.push({
      title: "Lunch",
      data: selectedMenu["lunch"] || [],
      grayOut: true,
      grayOutDescription: null
    })
    result.push({
      title: "Dinner",
      data: selectedMenu["dinner"] || [],
      grayOut: true,
      grayOutDescription: null
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

  return (
    <View style={{ ...styles.mainViewStyle, ...exploreStyles.mainView}}>
      <View style={styles.ordersPageMainView}>
        <View style={{ backgroundColor: "white" }}>
          <Text style={styles.headerWelcome}>
            <Text style={{ fontFamily: "helvetica-neue", color: "black" }}>Hello there!</Text>
          </Text>
          <Text style={styles.headerWelcome}>
            <Text style={{ fontFamily: "helvetica-neue-light", color: "black" }}>Explore the menu for upcoming days</Text>
          </Text>
        </View>
        <DateComponent onDateChange={setSelectedDate} />
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
                  style={styles.mainButton}
                  onPress={() => navigation.pop()}>
                  <Text style={{ color: "white" }}>Login to place an order</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

export default ExploreMenu

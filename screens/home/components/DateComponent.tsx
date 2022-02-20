import _ from "lodash"
import * as React from 'react'
import moment from 'moment'
import { useState } from 'react'
import { StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native'
import { Text, View } from '../../../components/Themed'
import { primaryColor } from '../../../commonUtils'
import Colors from "yoyoconstants/Colors"

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row"
  },
  date: {
    backgroundColor: "rgba(255, 170, 0, 0.08)",
    marginRight: 10,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#edda9f"
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 1,
  },
  selectedDate: {
    backgroundColor: "#F2C94C"
  },
  title: {
    fontSize: 16,
    color: "#4F4946",
    textTransform: "uppercase",
    fontWeight: "bold"
  },
  selectedDateTitle: {
    color: "#4F4946"
  },
  dateString: {
    fontSize: 15,
    fontWeight: "bold",
    color: "rgb(255, 170, 0)"
  }
})

const DateComponent = (props) => {
  const { onDateChange } = props
  const today = moment().utcOffset("530").format("YYYY-MM-DD")
  const tomorrow = moment(today).add(1, 'd').format("YYYY-MM-DD")
  const otherDates = []
  _.range(2, 7).forEach(gap => {
    otherDates.push(moment(today).add(gap, 'd').format("YYYY-MM-DD"))
  });

  const dayAfter = moment(today).add(2, 'd').format("YYYY-MM-DD")
  const [selectedDate, setSelectedDate] = useState<string>(today)

  const setDate = (date: string) => {
    onDateChange(date)
    setSelectedDate(date)
  }

  const getDateContainerStyles = (date: string) => {
    return {
      ...styles.date,
      ...(date === selectedDate) ? styles.selectedDate : {}
    }
  }

  const getDateTitleStyle = (date: string) => {
    return {
      ...styles.title,
      ...(date === selectedDate) ? styles.selectedDateTitle : {}
    }
  }

  const allDatesDom = () => {
    return otherDates.map(date => (
      <TouchableWithoutFeedback onPress={() => setDate(date)}>
        <View style={getDateContainerStyles(date)}>
          {/* <Text style={styles.title}>{moment(date).format("dddd")}</Text> */}
          <Text style={getDateTitleStyle(date)}>
            {moment(date).format("MMM DD")}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    ))
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ backgroundColor: "white" }}
        showsHorizontalScrollIndicator={false} 
        horizontal>
        <TouchableWithoutFeedback onPress={() => setDate(today)}>
          <View style={getDateContainerStyles(today)}>
            <Text style={getDateTitleStyle(today)}>Today</Text>
            {/* <Text style={styles.dateString}>
              {moment(today).format("ddd DD, MMM")}
            </Text> */}
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => setDate(tomorrow)}>
          <View style={getDateContainerStyles(tomorrow)}>
            <Text style={getDateTitleStyle(tomorrow)}>Tomorrow</Text>
            {/* <Text style={styles.dateString}>
              {moment(tomorrow).format("ddd DD, MMM")}
            </Text> */}
          </View>
        </TouchableWithoutFeedback>
        {allDatesDom()}
      </ScrollView>
    </View>
  )
}

export default DateComponent;
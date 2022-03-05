import _ from "lodash"
import * as React from 'react'
import moment from 'moment'
import { useState } from 'react'
import { StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native'
import { Text, View } from '../../../components/Themed'
import Colors from "yoyoconstants/Colors"
import * as Amplitude from 'expo-analytics-amplitude';

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row"
  },
  date: {
    backgroundColor: Colors.theme.backgroundLight,
    marginRight: 10,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#edda9f"
  },
  selectedDate: {
    backgroundColor: "#F2C94C"
  },
  title: {
    fontSize: 16,
    color: Colors.theme.text,
    textTransform: "uppercase",
    fontWeight: "bold"
  },
  selectedDateTitle: {
    color: "#4F4946"
  }
})

const DateComponent = (props) => {
  const { onDateChange, initialDate } = props
  const today = moment().utcOffset("530").format("YYYY-MM-DD")
  const tomorrow = moment(today).add(1, 'd').format("YYYY-MM-DD")
  const otherDates = []
  _.range(2, 7).forEach(gap => {
    otherDates.push(moment(today).add(gap, 'd').format("YYYY-MM-DD"))
  });

  const [selectedDate, setSelectedDate] = useState<string>(initialDate)

  const setDate = (date: string) => {
    onDateChange(date)
    setSelectedDate(date)
    trackDateChange(date)
  }

  const trackDateChange = async (date: string) => {
    const todayMoment = moment().utcOffset("530").format("YYYY-MM-DD");
    const selectedDate = moment(date);
    const selectedDateOffset = selectedDate.diff(todayMoment, "days");
    await Amplitude.logEventWithPropertiesAsync("DATE_CHANGED", { "selectedDateOffset": selectedDateOffset })
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
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => setDate(tomorrow)}>
          <View style={getDateContainerStyles(tomorrow)}>
            <Text style={getDateTitleStyle(tomorrow)}>Tomorrow</Text>
          </View>
        </TouchableWithoutFeedback>
        {allDatesDom()}
      </ScrollView>
    </View>
  )
}

export default DateComponent;
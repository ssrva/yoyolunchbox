import * as React from 'react'
import moment from 'moment'
import { useState } from 'react'
import { StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native'
import { Text, View } from '../../../components/Themed'
import { primaryColor } from '../../../commonUtils'

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row"
  },
  date: {
    backgroundColor: "#F1F1F1",
    marginRight: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
  },
  selectedDate: {
    backgroundColor: primaryColor
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold"
  },
  dateString: {
    fontSize: 15,
    fontWeight: "bold"
  }
})

const DateComponent = (props) => {
  const { onDateChange } = props
  const today = moment().utcOffset(530).format("YYYY-MM-DD")
  // const today = "2021-07-27"
  const tomorrow = moment(today).add(1, 'd').format("YYYY-MM-DD")
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

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ paddingBottom: 10 }}
        showsHorizontalScrollIndicator={false} 
        horizontal>
        <TouchableWithoutFeedback onPress={() => setDate(today)}>
          <View style={getDateContainerStyles(today)}>
            <Text style={styles.title}>Today</Text>
            <Text style={styles.dateString}>
              {moment(today).format("ddd DD, MMM")}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => setDate(tomorrow)}>
          <View style={getDateContainerStyles(tomorrow)}>
            <Text style={styles.title}>Tomorrow</Text>
            <Text style={styles.dateString}>
              {moment(tomorrow).format("ddd DD, MMM")}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => setDate(dayAfter)}>
          <View style={getDateContainerStyles(dayAfter)}>
            <Text style={styles.title}>{moment(dayAfter).format("dddd")}</Text>
            <Text style={styles.dateString}>
              {moment(dayAfter).format("ddd DD, MMM")}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  )
}

export default DateComponent;
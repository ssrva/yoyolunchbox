import _ from "lodash"
import moment from "moment"
import * as React from 'react';
import { useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import * as api from "../../api"
import { useSelector } from 'react-redux';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    display: "flex",
  },
  rowContainer: {
    display: "flex",
    backgroundColor: "white",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  description: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 15
  },
  time: {
    fontStyle: "italic"
  },
  amount: {
    fontWeight: "bold",
    fontSize: 18,
  },
  debit: {
    color: "red",
  },
  credit: {
    color: "green"
  }
})

const Transactions = (props) => {
  const user = useSelector(store => store.user)
  const [loading, setLoading] = useState<boolean>(false)
  const [transactions, setTransactions] = useState<Object[]>([])

  const getTransactions = async () => {
    setLoading(true)
    try {
      const data = await api.getUserTransactions(user.username)
      setTransactions(data)
    } catch (e) {
      console.log(e)
    }
    setLoading(false)
  }

  useEffect(() => {
    getTransactions()
  }, [])

  return (
    <View style={styles.container}>
      <FlatList
        onRefresh={getTransactions}
        refreshing={loading}
        data={transactions || []}
        renderItem={({item}) => {
          const isDebit = item.amount.toString().charAt(0) === '-'
          const amountClass = isDebit ? styles.debit : styles.credit
          const amount = isDebit ? item.amount.toString().substring(1) : item.amount
          return (
            <View style={styles.rowContainer}>
              <View>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.time}>
                  {moment(item.created_at).format("MMM DD, YYYY hh:mm A")}
                </Text>
              </View>
              <View>
                <Text style={{ ...amountClass, ...styles.amount }}>
                  {isDebit ? '-' : '+'} {'\u20A8'}.{amount}
                </Text>
              </View>
            </View>
          )
        }}
      />
    </View>
  )
}

export default Transactions
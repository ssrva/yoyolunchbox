import _ from "lodash"
import * as React from 'react';
import { useState } from 'react';
import { TouchableWithoutFeedback, View, Text, StyleSheet, Keyboard, ActivityIndicator, Modal } from 'react-native';
import * as api from "../../api"
import { useDispatch, useSelector } from 'react-redux';
import { Button, Radio } from "@ui-kitten/components";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from '@expo/vector-icons';
import { notifyMessage, secondaryColor, COLORS } from "common/utils";
import Spinner from "../home/components/Spinner"
import { setBalance } from "../../store/actions"
import * as Amplitude from "expo-analytics-amplitude"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  button: {
    alignItems: "center",
    backgroundColor: secondaryColor,
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  mainContainer: {
    display: "flex",
    flex: 1,
  },
  bottomContainer: {

  },
  planContainer: {
      borderWidth: 1,
      borderRadius: 5,
      borderColor: "#D1D1D1",
      padding: 10,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      paddingRight: 20,
      paddingLeft: 20,
      marginBottom: 20
  },
  planTitle: {
      fontWeight: "bold",
      fontSize: 16,
      marginBottom: 10,
      marginRight: 10
  },
  planDescription: {
    marginBottom: 5,
    color: "black",
    lineHeight: 25
  },
  planSaveText: {
    marginBottom: 5,
    color: "black",
    fontStyle: "italic",
    color: "#418134"
  },
  tag: {
    color: "black",
    alignSelf: "flex-start",
    backgroundColor: "#D4F1CA",
    padding: 5,
    marginBottom: 10,
    marginRight: 10,
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "#418134",
    borderRadius: 5,
    fontSize: 10,
    textTransform: "uppercase",
    overflow: "hidden",
  },
  messageBoxRed: {
    backgroundColor: "#F8D7DA",
    borderWidth: 1,
    borderColor: "#F5C6CB",
    marginBottom: 20,
    padding: 10,
    display: "flex",
    flexDirection: "row"
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalInnerContainer: {
    backgroundColor: "white",
    padding: 20,
    marginLeft: 30,
    marginRight: 30,
    shadowColor: COLORS.GRAY60,
    borderWidth: 1,
    borderColor: COLORS.GRAY80,
    borderRadius: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3.0,
    elevation: 1,
  },
  modalFooter: {
    backgroundColor: "white",
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end"
  },
})


const SubscriptionPlans = (props) => {
  const { navigation, refresh } = props
  const dispatch = useDispatch()
  const user = useSelector(store => store.user)
  const [loading, setLoading] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number>(0)
  const [activeSubscription, setActiveSubscription] = useState<Object>({})
  const [pageLoading, setPageLoading] = useState<boolean>(false)
  const balance = useSelector(store => store.balance)
  const plans = [
    {
      name: "Bronze",
      price: 149,
      deliveries: 7,
      validity: 10,
      popular: false,
      actualPrice: "199"
    },
    {
      name: "Silver",
      price: 499,
      deliveries: 30,
      validity: 40,
      popular: true,
      actualPrice: "749"
    },
    {
      name: "Gold",
      price: 1199,
      deliveries: 90,
      validity: 130,
      popular: false,
      actualPrice: "1799"
    }
  ]

  const fetchNewBalance = async () => {
    const balance = await api.getUserWalletBalance(user.username)
    dispatch(setBalance({ balance: balance?.balance || 0 }))
    setBalance(balance?.balance)
  }

  const purchasePlan = async () => {
    try {
      setShowModal(false)
      setLoading(true)
      const selectedPlan = plans[selectedPlanIndex]
      const response = await api.createSubscription(
        user.username, selectedPlan.name, selectedPlan.validity, selectedPlan.deliveries, selectedPlan.price
      )
      Amplitude.logEventWithPropertiesAsync("SUBSCRIPTION_PURCHASED", { "name": selectedPlan.name })
      fetchNewBalance()
      setLoading(false)
      refresh()
    } catch (e) {
      notifyMessage("Failed to purchase subscription, please try again later.")
    }
  }


  return (
    <View style={{ flex: 1 }}>
      <Spinner visible={loading} message="Purchasing subscription..."/>
      <View style={{ backgroundColor: "white" }}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={showModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalInnerContainer}>
              <Text style={{ color: "black" }}>Are you sure you want to purchase this plan? Money will be deducted from your YOYO Wallet</Text>
              <View style={styles.modalFooter}>
                <Button size="small" style={{ marginRight: 10 }} onPress={() => setShowModal(false)} status="danger">
                  <Text style={{ color: "white" }}>Cancel</Text>
                </Button>
                <Button size="small" onPress={purchasePlan}>
                  <Text style={{ color: "white" }}>Confirm Purchase</Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          {plans.map((plan, index) => {
            return (
              <TouchableWithoutFeedback onPress={() => setSelectedPlanIndex(index)}>
                <View style={styles.planContainer}>
                    <View style={{ flex: 1 }}>
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text style={styles.planTitle}>{plan.name} - <Text style={{ textDecorationLine: "line-through", color: "green" }}>{'\u20B9'}{plan.actualPrice}</Text> <Text style={{ color: "green" }}>{'\u20B9'}{plan.price}</Text></Text>
                        {plan.popular && (<Text style={styles.tag}>MOST POPULAR</Text>)}
                      </View>
                      <Text style={styles.planDescription}>Vaildity: {plan.validity} Days</Text>
                      <Text style={styles.planDescription}>{plan.deliveries} FREE Deliveries</Text>
                      <Text style={styles.planSaveText}>You save  {'\u20B9'}{(plan.deliveries * 40) - plan.price} on delivery charges!</Text>
                    </View>
                    <View>
                        <Radio checked={selectedPlanIndex == index} />
                    </View>
                </View>
            </TouchableWithoutFeedback>    
            )
          })}
        </View>
        <View style={styles.bottomContainer}>
          {balance < plans[selectedPlanIndex].price ? (
            <View style={styles.messageBoxRed}>
              <Text>You don't have enough money in your wallet to buy this plan. Please recharge your wallet to buy this plan.</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setShowModal(true)}
              style={styles.button}>
              {loading && <ActivityIndicator style={{ marginRight: 10 }} />}
              <Text style={{ color: "white" }}>Purchase Plan</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}

export default SubscriptionPlans
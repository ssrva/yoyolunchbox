import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { useState } from 'react';
import { TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { COLORS } from "common/utils";
import { Text, View } from '../../../components/Themed';
import { TOrderListItemProps } from 'common/types';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@ui-kitten/components';
import { clearCart } from "store/actions"

type TSelectorProps = {
  onChange: Function,
  count: number,
  item: TOrderListItemProps
}

const styles = StyleSheet.create({
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
  container: {
    backgroundColor: "white",
    alignSelf: "flex-start",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    shadowColor: COLORS.GRAY60,
    borderWidth: 1,
    borderColor: COLORS.GRAY80,
    borderRadius: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3.0,
    elevation: 1,
  },
  selectorButton: {
    padding: 5,
    fontWeight: "600",
  },
  countStyle: {
    color: "black",
    padding: 5,
    fontWeight: "600",
  }
})


const Selector = (props: TSelectorProps) => {
  const { onChange, item } = props
  const cart = useSelector(store => store.cart)
  const [count, setCount] = useState<number>(props.count || 0)
  const [showModal, setShowModal] = useState<boolean>(false)
  const dispatch = useDispatch()

  const cartItem = cart[item.id]
  React.useEffect(() => {
    setCount(cartItem?.quantity || 0)
  }, cartItem?.quantity)

  const clear = () => {
    dispatch(clearCart())
  }

  const updateCount = (offset: number) => {
    if (count == 0 && offset < 0) return

    if (cartHasConflicts()) {
      setShowModal(true)
    } else {
      sendUpdateCount(offset)
    }
  }
  
  const sendUpdateCount = (offset) => {
    setCount(count + offset)
    onChange(count + offset, offset == 1)
  }

  const cartHasConflicts = () => {
    const cartItems = Object.values(cart)
    if (cartItems.length == 0) {
        return false;
    }
    const cartItem = cartItems[0]
    if (cartItem.date == item.date && cartItem.type == item.type) {
        return false
    }
    return true
}

  return (
    <View style={{ backgroundColor: "white" }}>
      <View style={{ backgroundColor: "white" }}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={showModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalInnerContainer}>
              <Text style={{ color: "black" }}>Your cart already has items for different meals. Would you like to clear and add this?</Text>
              <View style={styles.modalFooter}>
                <Button size="small" style={{ marginRight: 10 }} onPress={() => setShowModal(false)}>
                  <Text style={{ color: "white" }}>Cancel</Text>
                </Button>
                <Button size="small" status={"danger"} onPress={() => {
                  clear()
                  sendUpdateCount(1)
                  setShowModal(false)
                }}>
                  <Text style={{ color: "white" }}>Clear and Add</Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.container}>
        <TouchableOpacity style={styles.selectorButton} onPress={() => updateCount(-1)}>
          <Ionicons size={18} name="remove" color="green" />
        </TouchableOpacity>
        <Text style={styles.countStyle}>{count}</Text>
        <TouchableOpacity style={styles.selectorButton} onPress={() => updateCount(1)}>
          <Ionicons size={18} name="add" color="green" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Selector
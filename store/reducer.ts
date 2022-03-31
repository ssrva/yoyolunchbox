import * as actions from "./actions"

const initialState = {
  user: {},
  cart: {}
}

const storeReducer = (state = initialState, action) => {
  const { type, payload } = action
  switch(type) {
    case actions.setUser.toString():
      return {
        ...state,
        user: payload.user,
      }
    case actions.setMenu.toString():
      return {
        ...state,
        menu: payload.menu,
      }
    case actions.setBalance.toString():
      return {
        ...state,
        balance: payload.balance,
      }
    case actions.updateCart.toString():
      const cart = Object.assign({}, state.cart)
      if (payload.quantity == 0) {
        console.log(cart)
        delete cart[payload.id]
        console.log(cart)
        return {
          ...state,
          cart: cart
        }
      } else {
        return {
          ...state,
          cart: {
            ...cart,
            [payload.id]: payload
          }
        }
      }
  }
  return state
}

export default storeReducer
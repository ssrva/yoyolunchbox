import * as actions from "./actions"

const initialState = {
  user: {}
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
  }
  return state
}

export default storeReducer
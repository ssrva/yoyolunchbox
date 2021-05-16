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
  }
  return state
}

export default storeReducer
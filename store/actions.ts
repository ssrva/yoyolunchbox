import { createAction } from "redux-actions"

export const setUser = createAction("SET_USER")
export const setUserWithTracking = createAction("SET_USER_WITH_TRACKING")
export const setMenu = createAction("SET_MENU")
export const setBalance = createAction("SET_BALANCE")
export const refreshBalance = createAction("REFRESH_BALANCE")
export const updateCart = createAction("UPDATE_CART")

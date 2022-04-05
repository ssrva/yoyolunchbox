import * as api from "api"
import { setUserWithTracking, refreshBalance, setBalance, setUser } from "./actions"
import { select, put, call, takeEvery, all } from 'redux-saga/effects'
import * as Amplitude from 'expo-analytics-amplitude'
import Constants from "expo-constants"
import * as Application from "expo-application"

/**
 * Makes api call to refresh the user balance in app.
 */
export function* refreshBalanceSaga() {
  try {
    const username: string = yield select(store => store.user.username)
    const balance: Object = yield call(api.getUserWalletBalance, username)
    if (balance?.balance != null) {
      const balanceData = { balance: balance.balance || 0 };
      yield put(setBalance(balanceData))
    }
  } catch (error) {
    console.error("Failed to fetch user balance")
  }
}

/**
 * Sets the user data in the store and initializes amplitude tracking.
 */
export function* setUserAndInitializeAmplitude(action) {
  try {
    yield put(setUser(action.payload))

    const user = action.payload.user
    yield Amplitude.setUserIdAsync(user.username)
    yield Amplitude.setUserPropertiesAsync({
      jsBundleVersion: Constants.manifest.extra?.jsPackageVersion,
      nativeAppVersion: Application.nativeApplicationVersion,
      nativeBuildVersion: Application.nativeBuildVersion
    })
  } catch (error) {
    console.error("Failed to set the user")
  }
}

export function* allSagas() {
  yield takeEvery(refreshBalance.toString(), refreshBalanceSaga)
  yield takeEvery(setUserWithTracking.toString(), setUserAndInitializeAmplitude)
}

export default function* rootSaga() {
  yield all([
    allSagas()
  ])
}
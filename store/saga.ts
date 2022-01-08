import * as api from "api"
import { refreshBalance, setBalance } from "./actions"
import { select, put, call, takeEvery, all } from 'redux-saga/effects'

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

export function* allSagas() {
  yield takeEvery(refreshBalance.toString(), refreshBalanceSaga)
}

export default function* rootSaga() {
  yield all([
    allSagas()
  ])
}
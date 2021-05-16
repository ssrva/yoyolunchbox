import { createStore } from "redux"
import { Provider } from "react-redux"
import firebase from 'firebase/app'
import React from 'react'
import { firebaseConfig } from "./constants"
import reducer from "./store/reducer"
import MainApp from "./MainApp"

const store = createStore(reducer)

export default function App() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  }

  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  )
}

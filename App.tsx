import { createStore } from "redux"
import { Provider } from "react-redux"
import firebase from 'firebase/app'
import React from 'react'
import { firebaseConfig } from "./constants"
import reducer from "./store/reducer"
import MainApp from "./MainApp"
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';

const store = createStore(reducer)

export default function App() {
  Amplify.configure(awsconfig);

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  }

  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  )
}

import { createStore } from "redux"
import { Provider } from "react-redux"
import React from 'react'
import reducer from "./store/reducer"
import MainApp from "./MainApp"
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';

const store = createStore(reducer)

export default function App() {
  Amplify.configure(awsconfig);

  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  )
}

import { createStore } from "redux"
import { Provider } from "react-redux"
import React from 'react'
import reducer from "./store/reducer"
import MainApp from "./MainApp"
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import * as Sentry from 'sentry-expo';

const store = createStore(reducer)

const App = () => {
  Amplify.configure(awsconfig);

  Sentry.init({
    dsn: 'https://e563ac58d2024ff5ad6ca60dd88aadf6@o1055846.ingest.sentry.io/6041985'
  });

  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  )
}

export default App
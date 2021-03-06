import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { Provider } from "react-redux"
import React from 'react'
import reducer from "./store/reducer"
import MainApp from "./MainApp"
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import * as Sentry from 'sentry-expo';
import sagas from "store/saga";
import { composeWithDevTools } from 'redux-devtools-extension'

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
)
sagaMiddleware.run(sagas);

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
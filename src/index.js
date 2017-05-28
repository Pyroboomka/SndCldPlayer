import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Route } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import './index.css'
import { history, configureStore } from './store/configureStore'

import App from './containers/App'

const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Route path='/songs/' component={App} />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)

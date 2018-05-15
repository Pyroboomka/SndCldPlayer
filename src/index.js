import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Route, Redirect, Switch } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import './index.css'
import 'react-virtualized/styles.css';
import { history, configureStore } from './store/configureStore'

import App from './containers/App'

const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route path="/songs/:query?/:timeframe?" component={App} />
        <Redirect from="/" to="/songs/chillstep/90" />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)

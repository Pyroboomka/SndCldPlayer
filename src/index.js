import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Route, Redirect } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import './index.css'
import { history, configureStore } from './store/configureStore'

import App from './containers/App'

const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <Route path='/songs' component={App} />
        <Redirect from='/' to='/songs' />
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)

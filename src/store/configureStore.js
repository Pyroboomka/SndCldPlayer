import { createStore, applyMiddleware, compose } from 'redux'
import { rootReducer } from '../reducers/rootReducer'
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'

const history = createHistory()
const middleware = routerMiddleware(history)
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export function configureStore (preLoadedState) {
  const store = createStore(
      rootReducer,
      preLoadedState,
      composeEnhancers(
          applyMiddleware(middleware),
          applyMiddleware(thunk))
  )
  return store
}

export { history }

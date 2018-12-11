import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from '../reducers'
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'

const history = createHistory()
const createRouterMiddleware = routerMiddleware(history)
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export function configureStore(preLoadedState) {
  const store = createStore(
    rootReducer,
    preLoadedState,
    composeEnhancers(
      applyMiddleware(createRouterMiddleware),
      applyMiddleware(thunk))
  )
  return store
}

export { history }

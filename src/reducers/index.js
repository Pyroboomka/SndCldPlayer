import { combineReducers } from 'redux'
import { _entities as entities } from './entities'
import playlists from './playlist'
import player from './player'
import environment from './environment'
import { routerReducer } from 'react-router-redux'

export default combineReducers({
  entities,
  playlists,
  player,
  environment,
  router: routerReducer,
})

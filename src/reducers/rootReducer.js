import { combineReducers } from 'redux'
import entities from './entitiesReducer'
import playlists from './playlistReducer'
import player from './playerReducer'
import { routerReducer } from 'react-router-redux'

export const rootReducer = combineReducers({
  entities,
  playlists,
  player,
  router: routerReducer
})

import merge from 'lodash/merge'

const initialState = {
  songs: {},
  users: {},
}
/*
  This is fucking genious thing.
*/
export function _entities(state = initialState, { entities }) {
  if (entities) {
    return merge({}, state, entities)
  }
  return state
}

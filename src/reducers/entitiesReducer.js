import merge from 'lodash/merge'

const initialState = {
  songs: {},
  users: {}
}
/*
  This is fucking genious thing.
*/
export default function entities (state = initialState, action) {
  if (action.entities) {
    return merge({}, state, action.entities)
  }
  return state
}

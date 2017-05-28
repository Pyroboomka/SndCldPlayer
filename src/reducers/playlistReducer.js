import { RECEIVE_PLAYLIST, REQUEST_PLAYLIST } from '../actions/playlistActions'

const initialPlaylistsState = {
  isFetching: false,
  songs: [],
  next_href: ''
}

function playlist (state = initialPlaylistsState, action) {
  switch (action.type) {
    case RECEIVE_PLAYLIST:
      return Object.assign({}, state, {
        isFetching: false,
        songs: [...state.songs, ...action.songsIDs],
        next_href: action.nextHref
      })
    case REQUEST_PLAYLIST:
      return Object.assign({}, state, {
        isFetching: true
      })
    default:
      return state
  }
}

function playlists (state = {}, action) {
  switch (action.type) {
    case RECEIVE_PLAYLIST:
      return Object.assign({}, state, {
        [action.tag]: playlist(state[action.tag], action)
      })
    case REQUEST_PLAYLIST:
      return Object.assign({}, state, {
        [action.tag]: playlist(state[action.tag], action)
      })
    default:
      return state
  }
}

export default playlists

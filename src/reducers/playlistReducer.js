import { RECEIVE_PLAYLIST, REQUEST_PLAYLIST, CHANGE_TIMEFRAME } from '../actions/playlistActions'

const initialPlaylistState = {
  isFetching: false,
  songs: [],
  next_href: ''
}

function playlist (state = initialPlaylistState, action) {
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
const initialPlaylistsState = {
  currentTimeframe: 7
}
function playlists (state = initialPlaylistsState, action) {
  switch (action.type) {
    case RECEIVE_PLAYLIST:
      return Object.assign({}, state, {
        [action.tag]: playlist(state[action.tag], action)
      })
    case REQUEST_PLAYLIST:
      return Object.assign({}, state, {
        [action.tag]: playlist(state[action.tag], action)
      })
    case CHANGE_TIMEFRAME: {
      return Object.assign({}, state, { currentTimeframe: action.newTimeframe })
    }
    default:
      return state
  }
}

export default playlists

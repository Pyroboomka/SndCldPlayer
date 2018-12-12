import { RECEIVE_PLAYLIST, REQUEST_PLAYLIST, CHANGE_TIMEFRAME } from '../actions/playlist'

const initialState = {
  isFetching: false,
  songs: [],
  next_href: '',
}

function playlist(state = initialState, action) {
  const { type } = action
  switch (type) {
    case REQUEST_PLAYLIST:
      return { ...state, isFetching: true }
    case RECEIVE_PLAYLIST:
      // return { ...state,
      //   isFetching: false,
      //   songs: [ ...state.songs, ...action.songIDs ],
      //   next_href : action.nextHref,
      // }
      return Object.assign({}, state, {
        isFetching: false,
        songs: [...state.songs, ...action.songsIDs],
        next_href: action.nextHref,
      })
    default:
      return state
  }
}

const initialPlaylistsState = {
  currentTimeframe: 90,
}

export default function playlists(state = initialPlaylistsState, action) {
  switch (action.type) {
    case RECEIVE_PLAYLIST:
      return Object.assign({}, state, {
        [action.tag]: playlist(state[action.tag], action),
      })
    case REQUEST_PLAYLIST:
      return Object.assign({}, state, {
        [action.payload]: playlist(state[action.payload], action),
      })
    case CHANGE_TIMEFRAME: {
      return Object.assign({}, state, { currentTimeframe: action.newTimeframe })
    }
    default:
      return state
  }
}

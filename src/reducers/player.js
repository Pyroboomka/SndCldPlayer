import { SET_CURRENT_SONG, SET_CURRENT_PLAYLIST, TOGGLE_PLAYER } from '../actions/player'

const initialPlayerState = {
  currentPlaylist: '',
  currentSongIndex: null,
  isPlaying: false,
}

function playlist(state = initialPlayerState, action) {
  const { type, payload } = action
  switch (type) {
    case (SET_CURRENT_SONG): {
      return Object.assign({}, state, { currentSongIndex: action.index, isPlaying: true })
    }
    case (SET_CURRENT_PLAYLIST): {
      return { ...state, currentPlaylist: payload }
    }
    case (TOGGLE_PLAYER): {
      return Object.assign({}, state, {isPlaying: !state.isPlaying})
    }
    default: return state
  }
}

export default playlist

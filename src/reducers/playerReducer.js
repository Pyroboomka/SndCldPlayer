import { SET_CURRENT_SONG, SET_CURRENT_PLAYLIST, TOGGLE_PLAYER } from '../actions/playerActions'

const initialPlayerState = {
  currentPlaylist: '',
  currentSongIndex: null,
  isPlaying: false
}

function playlist (state = initialPlayerState, action) {
  switch (action.type) {
    case (SET_CURRENT_SONG): {
      return Object.assign({}, state, { currentSongIndex: action.index, isPlaying: true })
    }
    case (SET_CURRENT_PLAYLIST): {
      return Object.assign({}, state, { currentPlaylist: action.playlist })
    }
    case (TOGGLE_PLAYER): {
      return Object.assign({}, state, {isPlaying: !state.isPlaying})
    }
    default: return state
  }
}

export default playlist

export const SET_CURRENT_SONG = 'SET_CURRENT_SONG'
export const SET_CURRENT_PLAYLIST = 'SET_CURRENT_PLAYLIST'
export const TOGGLE_PLAYER = 'TOGGLE_PLAYER'

export function setCurrentSong (index) {
  return {
    type: SET_CURRENT_SONG,
    index
  }
}

export function setCurrentPlaylist (playlist) {
  return (dispatch, getState) => {
    const playlists = getState().playlists
    const currentPlaylist = getState().player.currentPlaylist
    if (playlist in playlists && currentPlaylist !== playlist) {
      dispatch({ type: SET_CURRENT_PLAYLIST, playlist })
    }
  }
}

export function startPlayingSong (songId) {
  return (dispatch, getState) => {
    let currentPagePlaylist = getState().router.location.search.slice(3)
    dispatch(setCurrentPlaylist(currentPagePlaylist))
    dispatch(setCurrentSong(songId))
  }
}

export function togglePlayer () {
  return {
    type: TOGGLE_PLAYER
  }
}

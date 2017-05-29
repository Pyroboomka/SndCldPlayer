import { fetchNewSongs } from './songActions.js'
import { composePlaylistURL, composeURLWithDates } from '../utils/urlUtils'
export const RECEIVE_NEXTURL = 'RECEIVE_NEXTURL'
export const RECEIVE_PLAYLIST = 'RECEIVE_PLAYLIST'
export const REQUEST_PLAYLIST = 'REQUEST_PLAYLIST'

export function receiveNextURL (nextURL) {
  return {
    type: RECEIVE_NEXTURL,
    nextURL
  }
}

export function requestPlaylist (tag) {
  return {
    type: REQUEST_PLAYLIST,
    tag
  }
}

export function fetchMoreSongs (playlist) {
  return (dispatch, getState) => {
    const { playlists } = getState()
    let url = playlists[playlist].next_href
    dispatch(fetchNewSongs(playlist, url))
  }
}

export function fetchPlaylistIfNeeded (tag, timeframe) {
  return (dispatch, getState) => {
    const { playlists } = getState()
    if (shouldFetchSongs(tag, playlists)) {
      let url = composeURLWithDates(tag, timeframe)
      dispatch(fetchNewSongs(tag, url))
    }
  }
}

export function receivePlaylist (entities, tag, songsIDs, nextHref) {
  return {
    type: RECEIVE_PLAYLIST,
    entities,
    tag,
    songsIDs,
    nextHref
  }
}

export function shouldFetchSongs (playlist, playlists) {
  const activePlaylist = playlists[playlist]
  if (!activePlaylist) {
    return true
  }
  return false
}

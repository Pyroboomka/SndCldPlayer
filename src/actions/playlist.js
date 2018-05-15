import { fetchNewSongs } from './songs'
import { composeURLWithDates } from '../utils/urlUtils'

export const RECEIVE_NEXTURL = 'RECEIVE_NEXTURL'
export const RECEIVE_PLAYLIST = 'RECEIVE_PLAYLIST'
export const REQUEST_PLAYLIST = 'REQUEST_PLAYLIST'
export const CHANGE_TIMEFRAME = 'CHANGE_TIMEFRAME'

export function shouldFetchSongs(playlist, playlists) {
  const activePlaylist = playlists[playlist]
  return !activePlaylist
}

export function receiveNextURL(nextURL) {
  return {
    type: RECEIVE_NEXTURL,
    nextURL,
  }
}

export function requestPlaylist(tag) {
  return {
    type: REQUEST_PLAYLIST,
    payload: tag,
  }
}

export function fetchMoreSongs(playlist) {
  return (dispatch, getState) => {
    const { playlists } = getState()
    const url = playlists[playlist].next_href
    dispatch(fetchNewSongs(playlist, url))
  }
}

export const fetchPlaylistIfNeeded = (tag, timeframe) => (dispatch, getState) => {
  const { playlists } = getState()
  if (shouldFetchSongs(tag, playlists)) {
    const url = composeURLWithDates(tag, timeframe)
    dispatch(fetchNewSongs(tag, url))
  }
}

export function receivePlaylist(entities, tag, songsIDs, nextHref) {
  return {
    type: RECEIVE_PLAYLIST,
    entities,
    tag,
    songsIDs,
    nextHref,
  }
}

export function changeTimeframe(newTimeframe) {
  return {
    type: CHANGE_TIMEFRAME,
    newTimeframe,
  }
}

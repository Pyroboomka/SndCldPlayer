import { receivePlaylist, requestPlaylist } from './playlist'
import { normalize } from 'normalizr'
import { songSchema } from '../utils/schemes'

export const RECEIVE_SONGS = 'RECEIVE_SONGS'

export const fetchNewSongs = (playlistStoreName, url) => async(dispatch) => {
  dispatch(
    requestPlaylist(playlistStoreName)
  )
  const responseData = await fetch(url)
    .then(response => response.json())
  const normalizedData = normalize(responseData.collection, [ songSchema ])
  dispatch(
    receivePlaylist(normalizedData.entities, playlistStoreName, normalizedData.result, responseData.next_href)
  )
}

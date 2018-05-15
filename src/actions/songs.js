import { receivePlaylist, requestPlaylist } from './playlist'
import { normalize } from 'normalizr'
import { songSchema } from '../utils/schemes'

export const RECEIVE_SONGS = 'RECEIVE_SONGS'

export const fetchNewSongs = (playlistStoreName, url) => (dispatch) => {
  dispatch(requestPlaylist(playlistStoreName))
  fetch(url)
    .then(response => response.json())
    .then(json => {
      const normalizedData = normalize(json.collection, [ songSchema ])
      dispatch(receivePlaylist(normalizedData.entities, playlistStoreName, normalizedData.result, json.next_href))
    })
    .catch(err => { console.log(err.message) })
}

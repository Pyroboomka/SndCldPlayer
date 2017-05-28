import { receivePlaylist, requestPlaylist } from './playlistActions'
export const RECEIVE_SONGS = 'RECEIVE_SONGS'
// TBD: rewrite with normalizr
export function fetchNewSongs (tag, url) {
  return (dispatch, getState) => {
    dispatch(requestPlaylist(tag))

    fetch(url)
      .then(response => response.json())
      .then(json => {
        let collection = json.collection
        let songsObject = collection.map(song => {
          return {
            id: song.id,
            title: song.title,
            artwork_url: song.artwork_url,
            stream_url: song.stream_url,
            waveform_url: song.waveform_url,
            user_id: song.user_id,
            description: song.description,
            likes_count: song.likes_count,
            comment_count: song.comment_count,
            playback_count: song.playback_count
          }
        }).reduce((acc, song) => (Object.assign(acc, { [song.id]: song })), {})
        let usersObject = collection.map(song => {
          return {
            avatar_url: song.user.avatar_url,
            id: song.user.id,
            uri: song.user.uri,
            username: song.user.username,
            permalink: song.user.permalink
          }
        }).reduce((acc, user) => (Object.assign(acc, { [user.id]: user })), {})
        let songsIDs = []
        for (let propName in songsObject) {
          songsIDs.push(+propName)
        }
        //  filter duplicates here
        let entities = {
          songs: songsObject,
          users: usersObject
        }
        dispatch(receivePlaylist(entities, tag, songsIDs, json.next_href))
      })
      .catch(err => { console.log(err.message) })
  }
}

import { CLIENT_ID } from '../consts/Client'

export function composePlaylistURL (tag) {
  return `https://api.soundcloud.com/tracks?linked_partitioning=1&tags=${tag}&client_id=${CLIENT_ID}`
}

export function composeSongStreamURL (url) {
  return `${url}?client_id=${CLIENT_ID}`
}

export function composePlayerSongImageURL (url) {
  if (url === null) {
    return null
  }
  let smallImg = url.replace(/-large/g, '-badge')
  return smallImg
}
export function formatPlayerDuration (duration) {
  let minutes = Math.floor(duration / 60) || 0
  let seconds = Math.floor(duration % 60) || 0
  let bSeconds = (seconds >= 10) ? seconds : `0${seconds}`
  return `${minutes}:${bSeconds}`
}

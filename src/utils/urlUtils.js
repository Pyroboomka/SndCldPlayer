import { CLIENT_ID } from '../consts/Client'

/*release_day	RW	day of the release	21
release_month	RW	month of the release	5
release_year	RW	year of the release	2001*/

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

export function composeURLWithDates (tag, days) {
  let currentDate = new Date()
  let newSearchDate = currentDate.setDate(currentDate.getDate() - days)
  newSearchDate = new Date(newSearchDate).toISOString()
  let formattedDate = newSearchDate.replace('T', '%20').slice(0, -5)
  let url = `https://api.soundcloud.com/tracks?linked_partitioning=1&tags=${tag}&created_at[from]=${formattedDate}&client_id=${CLIENT_ID}`
  return url
}

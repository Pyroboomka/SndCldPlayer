import { CLIENT_ID } from '../consts/Client'

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

export function composeURLWithDates (tag, timeframe) {
  let splicedTag = timeframe >= 10 ? tag.slice(0, -2) : tag.slice(0, -1)
  let currentDate = new Date()
  let newSearchDate = currentDate.setDate(currentDate.getDate() - timeframe)
  newSearchDate = new Date(newSearchDate).toISOString()
  let formattedDate = newSearchDate.replace('T', '%20').slice(0, -5)
  let url = `https://api.soundcloud.com/tracks?linked_partitioning=1&tags=${splicedTag}&created_at[from]=${formattedDate}&client_id=${CLIENT_ID}`
  return url
}
/* Placeholder for future */
/*function composeURLNoDates (tag) {
  let url = `https://api.soundcloud.com/tracks?linked_partitioning=1&tags=${tag}&client_id=${CLIENT_ID}`
  return url
}*/

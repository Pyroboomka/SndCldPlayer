import { createSelector } from 'reselect'
import * as R from 'ramda'

const getEntities = state => state.entities
const getPlaylists = state => state.playlists
const displayedPlaylist = (_, playlist) => playlist
const _id = (_, id) => id

const getSongsEntities = createSelector(
  getEntities,
  entities => entities.songs,
)
const getUsersEntities = createSelector(
  getEntities,
  entities => entities.users,
)

const getScreenWidth = state => state.environment.width

export const getCurrentTimeframe = state => state.playlists.currentTimeframe
export const getPlayingPlaylist = state => state.player.currentPlaylist

export const getSongData = createSelector(
  [getSongsEntities, _id],
  (data, id) => data[id] || {}
)

export const getUserData = createSelector(
  [getUsersEntities, _id],
  (data, id) => data[id] || {}
)

const createGrid = (songs, itemsInRow) => {
  const songsCopy = songs.slice()
  const result = []
  while (songsCopy.length >= itemsInRow) {
    result.push(R.take(itemsInRow, songsCopy))
    songsCopy.splice(0, itemsInRow)
  }
  if (songsCopy.length !== 0) {
    result.push(songsCopy)
  }
  return result
}

// Songs per row depend on current screen width
export const getSongsGrid = createSelector(
  [getPlaylists, displayedPlaylist, getScreenWidth],
  (playlists, playlist, screenWidth) => {
    if (!playlists[playlist]) {
      return []
    }
    const { songs } = playlists[playlist]
    if (screenWidth <= 576) {
      // 1 in row, array of arrays to keep shape.
      return songs.map(item => [item])
    } else if (screenWidth > 576 && screenWidth <= 1200) {
      return createGrid(songs, 2)
    }
    // default: 3 in a row
    return createGrid(songs, 3)
  }
)

export const getSongsList = createSelector(
  [getPlaylists, displayedPlaylist],
  (playlists, playlist) => {
    if (!playlists[playlist]) {
      return []
    }
    return playlists[playlist].songs
  }
)

export const getNextHref = createSelector(
  [getPlaylists, displayedPlaylist],
  (playlists, playlist) => playlists[playlist] ? playlists[playlist].next_href : undefined
)

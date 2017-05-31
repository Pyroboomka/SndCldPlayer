import React, { Component } from 'react'
import { connect } from 'react-redux'
import { parseSearch } from '../utils/routerUtils'
import Player from '../components/Player'
class PlayerContainer extends Component {
  render () {
    const { player } = this.props
    if (player.isPlaying || player.currentPlaylist !== '') {
      return (
        <Player {...this.props} />
      )
    } else return null
  }
}
const mapStateToProps = (state) => {
  const { songs, users } = state.entities
  const { player, playlists } = state
  const searchString = state.router.location.search || '?q=chill&time=7'
  let parsedLocation = parseSearch(searchString)
  const timeframe = parsedLocation[1]
  const playlist = parsedLocation[0] + timeframe
  return {
    songs,
    users,
    playlists,
    player,
    playlist,
    timeframe
  }
}
export default connect(mapStateToProps)(PlayerContainer)

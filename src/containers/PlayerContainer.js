import React, { Component } from 'react'
import { connect } from 'react-redux'
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
  const playlist = state.router.location.search.slice(3)
  return {
    songs,
    users,
    playlists,
    playlist,
    player
  }
}
export default connect(mapStateToProps)(PlayerContainer)

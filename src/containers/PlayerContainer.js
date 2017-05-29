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
  const searchString = state.router.location.search || '?q=chill&time=7'
  const searchRegExp = /(\?q=.+)&(time=[0-9]{1,})/g
  const matchGroups = searchRegExp.exec(searchString)
  const playlist = matchGroups[1].slice(3)
  const timeframe = matchGroups[2].slice(5)
  return {
    songs,
    users,
    playlists,
    playlist,
    player,
    timeframe
  }
}
export default connect(mapStateToProps)(PlayerContainer)

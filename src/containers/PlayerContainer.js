import React, { Component } from 'react'
import { connect } from 'react-redux'
import { parseSearch } from '../utils/routerUtils'
import Player from '../components/Player'
import MobilePlayer from '../components/MobilePlayer'

class PlayerContainer extends Component {
  render() {
    const { player, env } = this.props
    if (player.isPlaying || player.currentPlaylist !== '') {
      if (env.width > 750) {
        return <Player {...this.props} />
      }
      return <MobilePlayer {...this.props} />
    }
    return null
  }
}

const mapStateToProps = (state) => {
  const { songs, users } = state.entities
  const { player, playlists } = state
  const env = state.environment
  const searchString = state.router.location.search || '?q=chill&time=7'
  const parsedLocation = parseSearch(searchString)
  const timeframe = parsedLocation[1]
  const playlist = parsedLocation[0] + timeframe
  return {
    env,
    songs,
    users,
    playlists,
    player,
    playlist,
    timeframe,
  }
}

export default connect(mapStateToProps)(PlayerContainer)

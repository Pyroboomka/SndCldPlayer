import React, { Component } from 'react'
import { connect } from 'react-redux'
import Player from '../components/Player'
import MobilePlayer from '../components/MobilePlayer'

class PlayerContainer extends Component {
  render() {
    const { player, environment } = this.props
    if (player.isPlaying || player.currentPlaylist !== '') {
      if (environment.width > 750) {
        return <Player {...this.props} />
      }
      return <MobilePlayer {...this.props} />
    }
    return null
  }
}

const mapStateToProps = (state) => {
  const { player, environment } = state
  return {
    environment,
    player,
  }
}

export default connect(mapStateToProps)(PlayerContainer)

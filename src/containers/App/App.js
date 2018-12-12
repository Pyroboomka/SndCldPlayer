import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push as _push } from 'react-router-redux'
import { updateEnvironment } from '../../actions/environment'
import PlaylistContainer from '../Playlist/PlaylistContainer'
import NavigationContainer from '../NavigationContainer'
import PlayerContainer from '../PlayerContainer'
import './styles.css'

class App extends Component {
  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions)
    this.props.updateEnvironment(window.innerWidth, window.innerHeight)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions)
  }

  updateDimensions = () => {
    this.props.updateEnvironment(window.innerWidth, window.innerHeight)
  }

  render() {
    return (
      <div className="app-container">
        <NavigationContainer />
        <PlaylistContainer match={this.props.match} />
        <PlayerContainer />
      </div>
    )
  }
}
const mapStateToProps = (state, ownProps) => {
  const { player, environment } = state
  const isPlayerActive = player.isPlaying || player.currentPlaylist !== ''
  const playlistHeight = isPlayerActive ? environment.height : environment.height + 50
  return {
    playlistHeight,
    ownProps,
  }
}

export default connect(
  mapStateToProps,
  { updateEnvironment, _push }
)(App)

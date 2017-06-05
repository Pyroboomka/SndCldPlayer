import React from 'react'
import ReactDOM from 'react-dom'
import Player from './Player'
import { formatPlayerDuration, composeSongStreamURL, composePlayerSongImageURL } from '../utils/urlUtils'

class MobilePlayer extends Player {
  constructor (props) {
    super(props)
    this.state = {
      isPlaying: false,
      repeat: false,
      shuffle: false,
      currentTime: 0,
      duration: 0
    }
  }
  componentDidMount () {
    const playerNode = ReactDOM.findDOMNode(this.refs.player)
    playerNode.addEventListener('loadedmetadata', this.handleLoadedMetaData)
    playerNode.addEventListener('timeupdate', this.handleTimeUpdate)
    playerNode.addEventListener('ended', this.handleEnded)
  }

  componentDidUpdate () {
    this.checkIfPlayerShouldPlay()
  }

  render () {
    const { songs, playlists, player } = this.props
    const { isPlaying } = this.props.player
    const playingSongId = playlists[player.currentPlaylist].songs[player.currentSongIndex]
    const curSong = songs[playingSongId]
    return (
      <div className='mobile-player'>
        <audio ref='player'src={composeSongStreamURL(curSong.stream_url)}>
        </audio>
        <div className='mobile-player-songImage'>
          <img src={composePlayerSongImageURL(curSong.artwork_url)} />
        </div>
        <div className='mobile-player-songdata'>
          <div className='mobile-player-songdata-title'>
            {curSong.title}
          </div>
          <div className='mobile-player-songdata-duration'>
            {formatPlayerDuration(this.state.currentTime)} / {formatPlayerDuration(this.state.duration)}
          </div>
        </div>
        <div className='mobile-player-controls'>
          <div className='player-controls-backward' onClick={this.previousSong}>
            <span className='glyphicon glyphicon-step-backward'></span>
          </div>
          <div className='player-controls-toggle' onClick={this.toggleMusic}>
            {isPlaying
              ? <span style={{color: 'greenyellow'}}
                className='glyphicon glyphicon-pause'></span>
              : <span className='glyphicon glyphicon-play'></span>}
          </div>
          <div className='player-controls-forward' onClick={this.nextSong}>
            <span className='glyphicon glyphicon-step-forward'></span>
          </div>
        </div>
      </div>
    )
  }
}
export default MobilePlayer

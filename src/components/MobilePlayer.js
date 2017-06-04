import React, { Component } from 'react'
import { togglePlayer, setCurrentSong } from '../actions/playerActions'
import ReactDOM from 'react-dom'
import { formatPlayerDuration, composeSongStreamURL, composePlayerSongImageURL } from '../utils/urlUtils'

class MobilePlayer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isPlaying: false,
      repeat: false,
      shuffle: false,
      currentTime: 0,
      duration: 0
    }
    this.toggleMusic = this.toggleMusic.bind(this)
    this.previousSong = this.previousSong.bind(this)
    this.nextSong = this.nextSong.bind(this)
    this.handleLoadedMetaData = this.handleLoadedMetaData.bind(this)
    this.handleTimeUpdate = this.handleTimeUpdate.bind(this)
    this.handleEnded = this.handleEnded.bind(this)
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

  checkIfPlayerShouldPlay () {
    const { isPlaying } = this.props.player
    const playerNode = ReactDOM.findDOMNode(this.refs.player)
    if (isPlaying && playerNode.currentTime === 0) {
      playerNode.play()
    }
  }
  handleLoadedMetaData () {
    const playerNode = ReactDOM.findDOMNode(this.refs.player)
    const duration = Math.floor(playerNode.duration)
    this.setState({
      duration: duration
    })
  }

  handleTimeUpdate () {
    if (this.state.isSeeking === true) {
      return
    }
    const playerNode = ReactDOM.findDOMNode(this.refs.player)
    let currentTime = Math.floor(playerNode.currentTime)
    if (currentTime !== this.state.currentTime) {
      this.setState({
        currentTime: currentTime
      })
    }
  }

  handleEnded () {
    if (this.state.repeat === true) {
      const playerNode = ReactDOM.findDOMNode(this.refs.player)
      playerNode.currentTime = 0
    } else {
      this.nextSong()
    }
  }

  toggleMusic () {
    const { dispatch } = this.props
    const { isPlaying } = this.props.player
    const playerNode = ReactDOM.findDOMNode(this.refs.player)
    isPlaying ? playerNode.pause() : playerNode.play()
    dispatch(togglePlayer())
  }

  previousSong () {
    const { dispatch } = this.props
    const { currentSongIndex } = this.props.player
    let newSongIndex = ((currentSongIndex - 1) >= 0) ? currentSongIndex - 1 : 0
    dispatch(setCurrentSong(newSongIndex))
  }

  nextSong () {
    const { dispatch, playlists } = this.props
    const { currentSongIndex, currentPlaylist } = this.props.player
    let maxPlaylistLength = playlists[currentPlaylist].songs.length - 1
    let newSongIndex = ((currentSongIndex + 1) >= maxPlaylistLength) ? maxPlaylistLength : currentSongIndex + 1
    dispatch(setCurrentSong(newSongIndex))
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

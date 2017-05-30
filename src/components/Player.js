import React, { Component } from 'react'
import { togglePlayer, setCurrentSong } from '../actions/playerActions'
import ReactDOM from 'react-dom'
import { formatPlayerDuration, composeSongStreamURL, composePlayerSongImageURL } from '../utils/urlUtils'

class Player extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isPlaying: false,
      volume: 0.5,
      repeat: false,
      currentTime: 0,
      duration: 0
    }
    this.toggleMusic = this.toggleMusic.bind(this)
    this.nextSong = this.nextSong.bind(this)
    this.previousSong = this.previousSong.bind(this)
    this.handleVolumeChange = this.handleVolumeChange.bind(this)
    this.handleLoadedMetaData = this.handleLoadedMetaData.bind(this)
    this.handleTimeUpdate = this.handleTimeUpdate.bind(this)
    this.handleEnded = this.handleEnded.bind(this)
    this.toggleRepeat = this.toggleRepeat.bind(this)
  }

  componentDidMount () {
    const playerNode = ReactDOM.findDOMNode(this.refs.player)
    playerNode.addEventListener('loadedmetadata', this.handleLoadedMetaData)
    playerNode.addEventListener('timeupdate', this.handleTimeUpdate)
    playerNode.addEventListener('ended', this.handleEnded)
    this.checkIfPlayerShouldPlay()
  }

  componentWillUnmount () {
    const playerNode = ReactDOM.findDOMNode(this.refs.player)
    playerNode.removeEventListener('loadedmetadata')
    playerNode.removeEventListener('timeupdate')
    playerNode.removeEventListener('ended')
  }

  handleLoadedMetaData () {
    const playerNode = ReactDOM.findDOMNode(this.refs.player)
    const duration = Math.floor(playerNode.duration)
    this.setState({
      duration: duration
    })
  }

  handleTimeUpdate () {
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

  componentDidUpdate () {
    const playerNode = ReactDOM.findDOMNode(this.refs.player)
    playerNode.volume = this.state.volume
    this.checkIfPlayerShouldPlay()
  }

  checkIfPlayerShouldPlay () {
    const { isPlaying } = this.props.player
    const playerNode = ReactDOM.findDOMNode(this.refs.player)
    if (isPlaying && playerNode.currentTime === 0) {
      playerNode.play()
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

  handleVolumeChange () {
    /*
    ** Research, how the hell can I NOT call setState 20 times per second.
    ** Feedback?
    */
    const volumeBar = ReactDOM.findDOMNode(this.refs.volume)
    this.setState({
      volume: volumeBar.value / 100
    })
  }
  handleSeek (e) {
    /** TBD */
  }

  toggleRepeat () {
    this.setState({
      repeat: !this.state.repeat
    })
  }


  render () {
    const { songs, playlists, player } = this.props
    const { isPlaying } = this.props.player
    const playingSongId = playlists[player.currentPlaylist].songs[player.currentSongIndex]
    const curSong = songs[playingSongId]
    const curWidth = (this.state.currentTime / this.state.duration) * 100

    return (
      <div className='player'>
        <audio ref='player' src={composeSongStreamURL(curSong.stream_url)}></audio>
        <div className='player-songIcon'
          style={{'backgroundImage': `url(${composePlayerSongImageURL(curSong.artwork_url)})`}}>
        </div>
        <div className='player-songTitle'>
          {curSong.title}
        </div>
        <div className='player-seek-container'>
          <div className='player-seek-bar-empty'>
            <div className='player-seek-bar-filled' style={{width: `${curWidth}%`}}></div>
            <div className='player-seek-handle-div' style={{left: `${curWidth}%`}}></div>
          </div>
        </div>
        <div className='player-duration'>
          {formatPlayerDuration(this.state.currentTime)} / {formatPlayerDuration(this.state.duration)}
        </div>
        <div className='player-controls'>
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
          <div className='player-controls-volume'>
            <div className='player-controls-volume-icon'>
              <span className='glyphicon glyphicon-volume-up'></span>
            </div>           
            <input ref='volume' type='range' min='0' max='100' step='5' onChange={this.handleVolumeChange} />
          </div>
          <div className='player-controls-options'>
            <div className='player-controls-options-repeat' onClick={this.toggleRepeat}>
              <span style={{color: `${this.state.repeat ? 'greenyellow' : 'white'}`}} className='glyphicon glyphicon-retweet'></span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Player

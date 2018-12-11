import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { togglePlayer, setCurrentSong } from '../actions/player'
import { parseSearch } from '../utils/routerUtils'
import { formatPlayerDuration, composeSongStreamURL, composePlayerSongImageURL } from '../utils/urlUtils'

class Player extends Component {
  state = {
    isPlaying: false,
    volume: 0.25,
    muted: false,
    repeat: false,
    shuffle: false,
    currentTime: 0,
    duration: 0,
    isSeeking: false,
    seekStartXDefault: 0,
    volumeStartX: 0,
  }

  componentDidMount() {
    const playerNode = ReactDOM.findDOMNode(this.refs.player)
    playerNode.addEventListener('loadedmetadata', this.handleLoadedMetaData)
    playerNode.addEventListener('timeupdate', this.handleTimeUpdate)
    playerNode.addEventListener('ended', this.handleEnded)
    document.addEventListener('keydown', this.handleKeypress)
    this.checkIfPlayerShouldPlay()
    const seekCont = document.querySelector('.player-seek-container')
    this.setState({ seekStartXDefault: seekCont.offsetLeft })
    const volumeCont = document.querySelector('.player-controls-volumebar-container')
    this.setState({ volumeStartX: volumeCont.parentNode.offsetLeft })
  }

  componentWillUnmount() {
    const playerNode = ReactDOM.findDOMNode(this.refs.player)
    playerNode.removeEventListener('loadedmetadata', null, false)
    playerNode.removeEventListener('timeupdate', null, false)
    playerNode.removeEventListener('ended', null, false)
  }

  componentDidUpdate() {
    const playerNode = ReactDOM.findDOMNode(this.refs.player)
    playerNode.volume = this.state.volume
    this.checkIfPlayerShouldPlay()
  }

  checkIfPlayerShouldPlay() {
    const { isPlaying } = this.props.player
    const playerNode = ReactDOM.findDOMNode(this.refs.player)
    if (isPlaying && playerNode.currentTime === 0) {
      playerNode.play()
    }
  }

  handleLoadedMetaData = () => {
    const playerNode = ReactDOM.findDOMNode(this.refs.player)
    const duration = Math.floor(playerNode.duration)
    this.setState({
      duration,
    })
  }

  handleTimeUpdate = () => {
    const { isSeeking, currentTime } = this.state
    if (isSeeking) {
      return
    }
    const playerNode = ReactDOM.findDOMNode(this.refs.player)
    const playerCurrentTime = Math.floor(playerNode.currentTime)
    if (playerCurrentTime !== currentTime) {
      this.setState({
        currentTime,
      })
    }
  }

  handleEnded = () => {
    if (this.state.repeat) {
      const playerNode = ReactDOM.findDOMNode(this.refs.player)
      playerNode.currentTime = 0
    } else {
      this.nextSong()
    }
  }

  toggleMusic = () => {
    const { isPlaying } = this.props.player
    const playerNode = ReactDOM.findDOMNode(this.refs.player)
    isPlaying ? playerNode.pause() : playerNode.play()
    this.props.togglePlayer()
  }

  previousSong = () => {
    const { currentSongIndex } = this.props.player
    const newSongIndex = currentSongIndex - 1 >= 0 ? currentSongIndex - 1 : 0
    this.props.setCurrentSong(newSongIndex)
  }

  nextSong = () => {
    const { playlists } = this.props
    const { currentSongIndex, currentPlaylist } = this.props.player
    const maxPlaylistLength = playlists[currentPlaylist].songs.length - 1
    const newSongIndex = currentSongIndex + 1 >= maxPlaylistLength ? maxPlaylistLength : currentSongIndex + 1
    this.props.setCurrentSong(newSongIndex)
  }

  handleKeypress = e => {
    const isInInput = e.target.tagName.match(/input/i)
    //  176: Next; 177: Prev; 178: Stop; 179: Play/pause
    if (!isInInput) {
      switch (e.keyCode) {
        case 32:
          e.preventDefault()
          this.toggleMusic()
          break
        case 176:
          this.nextSong()
          break
        case 177:
          this.previousSong()
          break
        case 179:
          this.toggleMusic()
          break
        default:
          break
      }
    }
  }

  handleJumpSeek = e => {
    const audioNode = ReactDOM.findDOMNode(this.refs.player)
    const maxWidth = ReactDOM.findDOMNode(this.refs.seekbarEmpty).clientWidth
    const newPosition = ((e.clientX - this.state.seekStartXDefault) / maxWidth) * Math.floor(audioNode.duration)
    audioNode.currentTime = newPosition
  }

  handleJumpVolume = e => {
    const audioNode = ReactDOM.findDOMNode(this.refs.player)
    const maxWidth = ReactDOM.findDOMNode(this.refs.volumebarEmpty).clientWidth
    const newVolume = (e.clientX - this.state.volumeStartX) / maxWidth
    audioNode.volume = +newVolume.toFixed(2)
    this.setState({ volume: +newVolume.toFixed(2) })
    console.log('Jump volume:', +newVolume.toFixed(2))
  }

  addSeekingMouseListeners() {
    document.addEventListener('mousemove', this.handleSeekDrag)
    document.addEventListener('mouseup', this.handleSeekUp)
  }

  removeSeekingMouseListeners() {
    document.removeEventListener('mousemove', this.handleSeekDrag, false)
    document.removeEventListener('mouseup', this.handleSeekUp, false)
  }

  handleSeekDown = e => {
    e.stopPropagation()
    this.addSeekingMouseListeners()
    this.setState({ isSeeking: true })
  }

  handleSeekDrag = e => {
    e.stopPropagation()
    const maxWidth = ReactDOM.findDOMNode(this.refs.seekbarEmpty).clientWidth
    let curWidthPercent = ((e.clientX - this.state.seekStartXDefault) / maxWidth) * 100
    const seekbar = ReactDOM.findDOMNode(this.refs.seekbar)
    const seekHandle = ReactDOM.findDOMNode(this.refs.seekHandle)
    if (curWidthPercent > 100) {
      curWidthPercent = 100
    }
    if (curWidthPercent < 0) {
      curWidthPercent = 0
    }
    seekbar.attributes.style.value = `width: ${+curWidthPercent}%`
    seekHandle.attributes.style.value = `left: ${+curWidthPercent}%`
  }

  handleSeekUp = e => {
    e.preventDefault()
    e.stopPropagation()
    this.handleJumpSeek(e)
    this.removeSeekingMouseListeners()
    this.setState({ isSeeking: false })
  }

  handleVolumeMouseover = e => {
    const volumebarCont = ReactDOM.findDOMNode(this.refs.volumebarEmpty)
    volumebarCont.addEventListener('wheel', this.handleVolumeWheel)
    volumebarCont.addEventListener('mouseout', this.handleVolumeMouseout)
  }

  handleVolumeWheel = e => {
    e.preventDefault()
    const volumeDiff = (-e.deltaY / 10000) * 5
    let newVolume = this.state.volume + volumeDiff
    if (newVolume > 1) {
      newVolume = 1
    }
    if (newVolume <= 0) {
      newVolume = 0
      // mute
    }
    this.setState({ volume: newVolume })
  }

  handleVolumeMouseout = e => {
    const volumebarCont = ReactDOM.findDOMNode(this.refs.volumebarEmpty)
    volumebarCont.removeEventListener('wheel', this.handleVolumeWheel, false)
    volumebarCont.removeEventListener('mouseout', this.handleVolumeMouseout, false)
  }

  toggleRepeat = () => {
    this.setState({
      repeat: !this.state.repeat,
    })
  }

  render() {
    const { songs, playlists, player } = this.props
    const { isPlaying } = this.props.player
    const playingSongId = playlists[player.currentPlaylist].songs[player.currentSongIndex]
    const curSong = songs[playingSongId]
    const curWidth = (this.state.currentTime / this.state.duration) * 100
    const curVolume = this.state.volume * 100

    return (
      <div className="player" ref="playerContainer">
        <audio ref="player" src={composeSongStreamURL(curSong.stream_url)} />
        <div className="player-songIcon" style={{ backgroundImage: `url(${composePlayerSongImageURL(curSong.artwork_url)})` }} />
        <div className="player-songTitle">{curSong.title}</div>
        <div className="player-seek-container">
          <div onClick={this.handleJumpSeek} ref="seekbarEmpty" className="player-seek-bar-empty">
            <div ref="seekbar" className="player-seek-bar-filled" style={{ width: `${curWidth}%` }} />
            <div
              ref="seekHandle"
              onMouseDown={this.handleSeekDown}
              className="player-seek-handle-div"
              style={{ left: `${curWidth}%` }}
            />
          </div>
        </div>
        <div className="player-duration">
          {formatPlayerDuration(this.state.currentTime)} / {formatPlayerDuration(this.state.duration)}
        </div>
        <div className="player-controls">
          <div className="player-controls-backward" onClick={this.previousSong}>
            <span className="glyphicon glyphicon-step-backward" />
          </div>
          <div className="player-controls-toggle" onClick={this.toggleMusic}>
            {isPlaying ? (
              <span style={{ color: 'greenyellow' }} className="glyphicon glyphicon-pause" />
            ) : (
              <span className="glyphicon glyphicon-play" />
            )}
          </div>
          <div className="player-controls-forward" onClick={this.nextSong}>
            <span className="glyphicon glyphicon-step-forward" />
          </div>
        </div>
        <div className="player-controls-volumeicon">
          <span className="glyphicon glyphicon-volume-up" />
        </div>
        <div className="player-controls-volume">
          <div onMouseOver={this.handleVolumeMouseover} ref="volumebarEmpty" className="player-controls-volumebar-container">
            <div onClick={this.handleJumpVolume} className="player-controls-volumebar-empty">
              <div ref="volumebar" style={{ width: `${curVolume}%` }} className="player-controls-volumebar-filled" />
              <div ref="volumehandle" style={{ left: `${curVolume}%` }} className="player-controls-volumebar-handle" />
            </div>
          </div>
          <div className="player-controls-options">
            <div className="player-controls-options-repeat" onClick={this.toggleRepeat}>
              <span style={{ color: `${this.state.repeat ? 'greenyellow' : 'white'}` }} className="glyphicon glyphicon-retweet" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { songs, users } = state.entities
  const { player, playlists } = state
  const { environment } = state
  const searchString = state.router.location.search || '?q=chill&time=7'
  const parsedLocation = parseSearch(searchString)
  const timeframe = parsedLocation[1]
  const playlist = parsedLocation[0] + timeframe
  return {
    environment,
    songs,
    users,
    playlists,
    player,
    playlist,
    timeframe,
  }
}

export default connect(
  mapStateToProps,
  { togglePlayer, setCurrentSong }
)(Player)

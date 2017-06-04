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
      muted: false,
      repeat: false,
      shuffle: false,
      currentTime: 0,
      duration: 0,
      isSeeking: false,
      seekStartXDefault: 0,
      volumeStartX: 0
    }
    this.toggleMusic = this.toggleMusic.bind(this)
    this.nextSong = this.nextSong.bind(this)
    this.previousSong = this.previousSong.bind(this)
    this.handleLoadedMetaData = this.handleLoadedMetaData.bind(this)
    this.handleTimeUpdate = this.handleTimeUpdate.bind(this)
    this.handleEnded = this.handleEnded.bind(this)
    this.toggleRepeat = this.toggleRepeat.bind(this)
    this.handleKeypress = this.handleKeypress.bind(this)
    this.handleSeekDown = this.handleSeekDown.bind(this)
    this.handleSeekUp = this.handleSeekUp.bind(this)
    this.handleSeekDrag = this.handleSeekDrag.bind(this)
    this.handleJumpSeek = this.handleJumpSeek.bind(this)
    this.handleJumpVolume = this.handleJumpVolume.bind(this)
    this.handleVolumeMouseover = this.handleVolumeMouseover.bind(this)
    this.handleVolumeWheel = this.handleVolumeWheel.bind(this)
    this.handleVolumeMouseout = this.handleVolumeMouseout.bind(this)
  }

  componentDidMount () {
    const playerNode = ReactDOM.findDOMNode(this.refs.player)
    playerNode.addEventListener('loadedmetadata', this.handleLoadedMetaData)
    playerNode.addEventListener('timeupdate', this.handleTimeUpdate)
    playerNode.addEventListener('ended', this.handleEnded)
    document.addEventListener('keydown', this.handleKeypress)
    this.checkIfPlayerShouldPlay()
    let seekCont = document.querySelectorAll('.player-seek-container')[0]
    this.setState({ seekStartXDefault: seekCont.offsetLeft })
    let volumeCont = document.querySelectorAll('.player-controls-volumebar-container')[0]
    this.setState({ volumeStartX: volumeCont.parentNode.offsetLeft })
  }

  componentWillUnmount () {
    const playerNode = ReactDOM.findDOMNode(this.refs.player)
    playerNode.removeEventListener('loadedmetadata', null, false)
    playerNode.removeEventListener('timeupdate', null, false)
    playerNode.removeEventListener('ended', null, false)
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

  handleKeypress (e) {
    let isInInput = e.target.tagName.match(/input/i)
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

  handleJumpSeek (e) {
    const audioNode = ReactDOM.findDOMNode(this.refs.player)
    const maxWidth = ReactDOM.findDOMNode(this.refs.seekbarEmpty).clientWidth
    let newPosition = ((e.clientX - this.state.seekStartXDefault) / maxWidth) * Math.floor(audioNode.duration)
    audioNode.currentTime = newPosition
  }

  handleJumpVolume (e) {
    const audioNode = ReactDOM.findDOMNode(this.refs.player)
    const maxWidth = ReactDOM.findDOMNode(this.refs.volumebarEmpty).clientWidth
    let newVolume = ((e.clientX - this.state.volumeStartX) / maxWidth)
    audioNode.volume = +newVolume.toFixed(2)
    this.setState({ volume: +newVolume.toFixed(2) })
    console.log('Jump volume:', +newVolume.toFixed(2))
  }

  addSeekingMouseListeners () {
    let seekbar = ReactDOM.findDOMNode(this.refs.seekbar)
    let seekHandle = ReactDOM.findDOMNode(this.refs.seekHandle)
    seekbar.addEventListener('mousemove', this.handleSeekDrag)
    seekbar.addEventListener('mouseup', this.handleSeekUp)
    seekHandle.addEventListener('mousemove', this.handleSeekDrag)
    seekHandle.addEventListener('mouseup', this.handleSeekUp)
  }

  removeSeekingMouseListeners () {
    let seekbar = ReactDOM.findDOMNode(this.refs.seekbar)
    let seekHandle = ReactDOM.findDOMNode(this.refs.seekHandle)
    seekbar.removeEventListener('mousemove', this.handleSeekDrag, false)
    seekbar.removeEventListener('mouseup', this.handleSeekUp, false)
    seekHandle.removeEventListener('mousemove', this.handleSeekDrag, false)
    seekHandle.removeEventListener('mouseup', this.handleSeekUp, false)
  }

  handleSeekDown (e) {
    e.stopPropagation()
    this.addSeekingMouseListeners()
    this.setState({ isSeeking: true })
  }

  handleSeekDrag (e) {
    e.stopPropagation()
    let maxWidth = ReactDOM.findDOMNode(this.refs.seekbarEmpty).clientWidth
    let curWidthPercent = (e.clientX - this.state.seekStartXDefault) / maxWidth * 100
    let seekbar = ReactDOM.findDOMNode(this.refs.seekbar)
    let seekHandle = ReactDOM.findDOMNode(this.refs.seekHandle)
    if (curWidthPercent > 100) {
      curWidthPercent = 100
    }
    if (curWidthPercent < 0) {
      curWidthPercent = 0
    }
    seekbar.attributes.style.value = `width: ${+curWidthPercent}%`
    seekHandle.attributes.style.value = `left: ${+curWidthPercent}%`
  }

  handleSeekUp (e) {
    e.preventDefault()
    e.stopPropagation()
    // handleJumpSeek takes care of setting correct currentTime on audio
    this.removeSeekingMouseListeners()
    this.setState({ isSeeking: false })
  }

  handleVolumeMouseover (e) {
    let volumebarCont = ReactDOM.findDOMNode(this.refs.volumebarEmpty)
    volumebarCont.addEventListener('wheel', this.handleVolumeWheel)
    volumebarCont.addEventListener('mouseout', this.handleVolumeMouseout)
  }

  handleVolumeWheel (e) {
    e.preventDefault()
    let volumeDiff = -e.deltaY / 10000 * 5
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

  handleVolumeMouseout (e) {
    let volumebarCont = ReactDOM.findDOMNode(this.refs.volumebarEmpty)
    volumebarCont.removeEventListener('wheel', this.handleVolumeWheel, false)
    volumebarCont.removeEventListener('mouseout', this.handleVolumeMouseout, false)
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
    const curVolume = this.state.volume * 100

    return (
      <div className='player'>
        <audio
          ref='player'
          src={composeSongStreamURL(curSong.stream_url)}>
        </audio>
        <div
          className='player-songIcon'
          style={{'backgroundImage': `url(${composePlayerSongImageURL(curSong.artwork_url)})`}} />
        <div className='player-songTitle'>
          {curSong.title}
        </div>
        <div className='player-seek-container'>
          <div onClick={this.handleJumpSeek} ref='seekbarEmpty'className='player-seek-bar-empty'>
            <div
              ref='seekbar'
              className='player-seek-bar-filled'
              style={{width: `${curWidth}%`}} />
            <div
              ref='seekHandle'
              onMouseDown={this.handleSeekDown}
              className='player-seek-handle-div'
              style={{left: `${curWidth}%`}} />
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
        </div>
        <div className='player-controls-volumeicon'>
          <span className='glyphicon glyphicon-volume-up'></span>
        </div>
        <div className='player-controls-volume'>
          <div onMouseOver={this.handleVolumeMouseover} ref='volumebarEmpty' className='player-controls-volumebar-container'>
            <div onClick={this.handleJumpVolume} className='player-controls-volumebar-empty'>
              <div ref='volumebar'
                style={{width: `${curVolume}%`}}
                className='player-controls-volumebar-filled' />
              <div ref='volumehandle'
                style={{left: `${curVolume}%`}}
                className='player-controls-volumebar-handle' />
            </div>
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

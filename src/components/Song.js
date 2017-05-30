import React, { Component } from 'react'
import CoverWithPlaybutton from './CoverWithPlaybutton'
import { startPlayingSong, togglePlayer } from '../actions/playerActions'

class Song extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isPlaying: false
    }
    this.toggleSong = this.toggleSong.bind(this)
  }

  componentDidMount () {
    this.checkIsPlaying(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.checkIsPlaying(nextProps)
  }

  checkIsPlaying (props) {
    const { currentSongIndex, currentPlaylist, isPlaying } = props.player
    const { songData, playlistSongs, playlist } = props
    let newisPlaying = (songData.id === playlistSongs[currentSongIndex]) && (currentPlaylist === playlist) && (isPlaying)
    this.setState({isPlaying: newisPlaying})
  }

  toggleSong () {
    const { dispatch, songData, playlistSongs, player, playlist } = this.props
    let songIndex = playlistSongs.indexOf(songData.id)
    if (player.currentSongIndex !== songIndex || playlist !== player.currentPlaylist) {
      dispatch(startPlayingSong(playlist, songIndex))
    } else {
      const playerNode = document.getElementsByTagName('audio')[0]
      if (playerNode) {
        player.isPlaying ? playerNode.pause() : playerNode.play()
      }
      dispatch(togglePlayer())
    }
  }

  render () {
    const { songData, playlistSongs, player, playlist } = this.props
    const isBorderActive = (playlistSongs.indexOf(songData.id) === player.currentSongIndex) && (player.currentPlaylist === playlist)
    const { artwork_url, title, likes_count, comment_count, playback_count, description } = songData
    const { username } = this.props.userData
    return (
      <div className={`songCard ` + (this.state.isPlaying || isBorderActive ? 'activeSong' : '')}>
        <CoverWithPlaybutton
          artwork_url={artwork_url}
          isPlaying={this.state.isPlaying}
          toggleSong={this.toggleSong}
        />
        <div className='songCard-info'>
          <div className='songCard-info-title'>
            {title}
          </div>
          <div className='songCard-info-user'>
            by {username}
          </div>
          <div className='songCard-info-stats'>
            <div className='songCard-info-stats-likes'>
              <span className='glyphicon glyphicon-heart'></span> {likes_count}
            </div>
            <div className='songCard-info-stats-comment'>
              <span className='glyphicon glyphicon-envelope'></span> {comment_count}
            </div>
            <div className='songCard-info-stats-playback'>
              <span className='glyphicon glyphicon-play'></span> {playback_count}
            </div>
          </div>
          <div className='songCard-info-description'>
            {description || ''}
          </div>
        </div>
      </div>
    )
  }
}
export default Song

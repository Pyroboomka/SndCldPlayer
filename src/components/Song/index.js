import React, { Component } from 'react'
import { connect } from 'react-redux'
import SongComponent from './SongComponent'
import { getSongData, getUserData } from '../../reducers/selectors'
import { startPlayingSong, togglePlayer } from '../../actions/player'

class Song extends Component {
  state = {
    isSongPlaying: false,
  }

  componentDidMount() {
    const { currentSongIndex, currentPlaylist, isPlaying } = this.props.player
    const { songData, playlistSongs, playlist } = this.props
    const isSongPlaying = songData.id === playlistSongs[currentSongIndex] && currentPlaylist === playlist && isPlaying
    this.setState({ isSongPlaying })
  }

  checkIsPlaying(props) {
    const { currentSongIndex, currentPlaylist, isPlaying } = props.player
    const { songData, playlistSongs, playlist } = props
    const newisPlaying = songData.id === playlistSongs[currentSongIndex] && currentPlaylist === playlist && isPlaying
    this.setState({ isPlaying: newisPlaying })
  }

  toggleSong = () => {
    const { songData, playlistSongs, player, playlist } = this.props
    const songIndex = playlistSongs.indexOf(songData.id)
    if (player.currentSongIndex !== songIndex || playlist !== player.currentPlaylist) {
      this.props.startPlayingSong(playlist, songIndex)
    } else {
      const playerNode = document.getElementsByTagName('audio')[0]
      if (playerNode) {
        player.isPlaying ? playerNode.pause() : playerNode.play()
      }
      this.props.togglePlayer()
    }
  }

  render() {
    const { songData, userData, player, playlistSongs, playlist } = this.props
    const isBorderActive = playlistSongs.indexOf(songData.id) === player.currentSongIndex && player.currentPlaylist === playlist
    const { artwork_url, title, likes_count, comment_count, playback_count, description } = songData
    const { username } = userData
    const datum = {
      artwork_url,
      title,
      likes_count,
      comment_count,
      playback_count,
      description,
      username,
    }
    return (
      <SongComponent
        isSongPlaying={isBorderActive && player.isPlaying}
        isBorderActive={isBorderActive}
        datum={datum}
        toggleSong={this.toggleSong}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { id, playlist } = ownProps
  const songData = getSongData(state, id)
  return {
    player: state.player,
    playlist,
    playlistSongs: state.playlists[playlist].songs,
    songData,
    userData: getUserData(state, songData.user_id),
  }
}

export default connect(
  mapStateToProps,
  { startPlayingSong, togglePlayer }
)(Song)

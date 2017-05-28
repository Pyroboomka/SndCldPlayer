import { connect } from 'react-redux'
import React, { Component } from 'react'
import Songs from '../components/Songs'

import { fetchMoreSongs, fetchPlaylistIfNeeded } from '../actions/playlistActions'

class Playlist extends Component {
  componentWillMount () {
    const { dispatch, playlists, playlist } = this.props
    if (!(playlist in playlists)) {
      dispatch(fetchPlaylistIfNeeded(playlist))
    }
  }

  componentWillReceiveProps (nextProps) {
    const { dispatch, playlist } = this.props
    if (playlist !== nextProps.playlist) {
      dispatch(fetchPlaylistIfNeeded(nextProps.playlist))
    }
  }

  handleLoadMoreClick () {
    const { dispatch, playlist } = this.props
    dispatch(fetchMoreSongs(playlist))
  }

  render () {
    return (
      <div className='content'>
        <button onClick={this.handleLoadMoreClick.bind(this)}
          className='placeholder-infinitescroll-button'>Inifinte scroll placeholder at the top, click it
        </button>
        <Songs {...this.props} />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  const { songs, users } = state.entities
  const { playlists, player } = state
  const { location } = state.router
  const playlist = location.search.slice(3) || 'chill'
  return {
    songs,
    users,
    playlists,
    playlist,
    player
  }
}

export default connect(mapStateToProps)(Playlist)

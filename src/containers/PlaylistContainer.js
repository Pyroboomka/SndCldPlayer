import { connect } from 'react-redux'
import React, { Component } from 'react'
import Songs from '../components/Songs'

import { fetchMoreSongs, fetchPlaylistIfNeeded } from '../actions/playlistActions'

class Playlist extends Component {
  componentWillMount () {
    const { dispatch, playlists, playlist, timeframe } = this.props
    if (!(playlist in playlists)) {
      dispatch(fetchPlaylistIfNeeded(playlist, timeframe))
    }
  }

  componentWillReceiveProps (nextProps) {
    const { dispatch, playlist } = this.props
    if (playlist !== nextProps.playlist) {
      dispatch(fetchPlaylistIfNeeded(nextProps.playlist, nextProps.timeframe))
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
  const searchString = state.router.location.search || '?q=chill&time=7'
  const searchRegExp = /(\?q=.+)&(time=[0-9]{1,})/g
  const matchGroups = searchRegExp.exec(searchString)
  const playlist = matchGroups[1].slice(3)
  const timeframe = matchGroups[2].slice(5)
  return {
    songs,
    users,
    playlists,
    playlist,
    timeframe,
    player
  }
}

export default connect(mapStateToProps)(Playlist)

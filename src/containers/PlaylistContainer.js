import { connect } from 'react-redux'
import React, { Component } from 'react'
import Songs from '../components/Songs'
import { fetchMoreSongs, fetchPlaylistIfNeeded } from '../actions/playlist'

class Playlist extends Component {
  componentDidMount() {
    const { playlists, playlist, timeframe } = this.props
    if (!(playlist in playlists)) {
      this.props.fetchPlaylistIfNeeded(playlist, timeframe)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { playlist } = this.props
    if (playlist !== nextProps.playlist) {
      this.props.fetchPlaylistIfNeeded(nextProps.playlist, nextProps.timeframe)
    }
  }

  render() {
    return (
      <div className="container-fluid">
        <Songs {...this.props} />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { query, timeframe } = ownProps.match.params
  const { playlists } = state
  return {
    playlists,
    playlist: query + timeframe,
    timeframe,
  }
}


export default connect(mapStateToProps, { fetchPlaylistIfNeeded })(Playlist)

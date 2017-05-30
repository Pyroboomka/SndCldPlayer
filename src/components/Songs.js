import React from 'react'
import Song from './Song'

class Songs extends React.Component {
//  DO i even need it? Merge Playlist and Songs?
  renderPlaylistSongs () {
    const { songs, users, playlists, player } = this.props
    const playlist = this.props.playlist
    const playlistSongs = playlists[playlist].songs
    return playlistSongs.map(item => {
      let songData = songs[item]
      let userData = users[songData.user_id]
      return (
        <Song
          key={songData.id}
          songData={songData}
          userData={userData}
          playlist={this.props.playlist}
          playlistSongs={playlistSongs}
          player={player}
          dispatch={this.props.dispatch} />
      )
    })
  }

  render () {
    const { playlists } = this.props
    const playlist = this.props.playlist
    if (!(playlist in playlists) || playlists[playlist].isFetching === true) {
      return (
        <div>
          Loading...
        </div>
      )
    } else {
      return (
        <div className='row'>
          <div className='col-lg-8 col-md-12 col-xs-12 songsContainer'>
            {this.renderPlaylistSongs()}
          </div>
        </div>
      )
    }
  }
}



export default Songs

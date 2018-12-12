import React, { Component } from 'react'
import CoverWithPlaybutton from './CoverWithPlaybutton'
import './styles.css'

class SongComponent extends Component {
  render() {
    const { isBorderActive, isSongPlaying, datum, opacity } = this.props
    return (
      <div className={'songCard ' + (isSongPlaying || isBorderActive ? 'activeSong' : '')} style={{ opacity }}>
        <CoverWithPlaybutton
          artwork_url={datum.artwork_url}
          isSongPlaying={isSongPlaying}
          toggleSong={this.props.toggleSong}
        />
        <div className="songCard-info">
          <div className="songCard-info-title">
            {datum.title}
          </div>
          <div className="songCard-info-user">
            by {datum.username}
          </div>
          <div className="songCard-info-stats">
            <div className="songCard-info-stats-likes">
              <i className="icon ion-ios-heart" /> {datum.likes_count}
            </div>
            <div className="songCard-info-stats-comment">
              <i className="icon ion-ios-mail" /> {datum.comment_count}
            </div>
            <div className="songCard-info-stats-playback">
              <i className="icon ion-ios-play" /> {datum.playback_count}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SongComponent

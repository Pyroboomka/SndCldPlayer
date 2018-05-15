import React, { Component } from 'react'

class CoverWithPlayButton extends Component {
  render() {
    return (
      <div className="songCard-image" style={{'backgroundImage': `url(${this.props.artwork_url})`}}>
        <div className="songCard-image-playbutton" onClick={this.props.toggleSong}>
          {this.props.isSongPlaying
            ? <i className="icon ion-ios-pause" />
            : <i className="icon ion-ios-play" /> }
        </div>
      </div>
    )
  }
}

export default CoverWithPlayButton

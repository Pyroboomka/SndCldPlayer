import React, { Component } from 'react'
class CoverWithPlayButton extends Component {
  render () {
    return (
      <div className='songCard-image' style={{'backgroundImage': `url(${this.props.artwork_url})`}}>
        <div className='songCard-image-playbutton' onClick={this.props.toggleSong}>
          {this.props.isPlaying
          ? <span className='glyphicon glyphicon-pause'></span>
          : <span className='glyphicon glyphicon-play'></span>}
        </div>
      </div>
    )
  }
}

export default CoverWithPlayButton

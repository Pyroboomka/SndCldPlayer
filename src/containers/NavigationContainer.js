import { connect } from 'react-redux'
import React, { Component } from 'react'
import { push } from 'react-router-redux'
import { changeTimeframe } from '../actions/playlistActions'

class Navigation extends Component {
  constructor (props) {
    super(props)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange (e) {
    if (e.charCode === 13) {
      const { dispatch } = this.props
      const { currentTimeframe } = this.props.playlists
      let tag = e.currentTarget.value.trim()
      if (tag !== '') {
        // This probably shoudn't work like this, RTFM later
        dispatch(push(`/songs?q=${tag}&time=${currentTimeframe}`))
      }
    }
  }

  handleTimeframeChange (newTimeframe) {
    const { dispatch } = this.props
    const { currentTimeframe } = this.props.playlists
    if (currentTimeframe !== newTimeframe) {
      dispatch(changeTimeframe(newTimeframe))
    }
  }

  renderTimeframes () {
    const { currentTimeframe } = this.props.playlists
    const timeframes = [7, 14, 30, 90];
    return timeframes.map(number =>
      <div key={number}
        className={`searchbar-timeframes-option ${currentTimeframe === number ? 'searchbar-active' : ''}`}
        style={{}}
        onClick={this.handleTimeframeChange.bind(this, number)}>
        {number}
      </div>)
  }

  render () {
    return (
      <div className='header'>
        <div className='logo'>
          <div className='logo-icon'>
            <span className='glyphicon glyphicon-bullhorn'></span>
          </div>
          <div className='logo-name'>
            <a href='/songs'><h3>Sndcldplayer</h3></a>
          </div>
        </div>
        <div className='searchbar'>
          <div className='searchbar-timeframes'>
            {this.renderTimeframes()}
            <span className='searchbar-timeframes-label'>days old</span>
          </div>
          <div className='searchbar-label'>
            <span className='glyphicon glyphicon-search'></span>
          </div>
          <div className='searchbar-input'>
            <input onKeyPress={this.handleInputChange} type='text' className='form-control' placeholder='tag goes here' />
          </div>
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => state

export default connect(mapStateToProps)(Navigation)

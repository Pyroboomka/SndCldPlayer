import { connect } from 'react-redux'
import React, { Component } from 'react'
import { push as _push } from 'react-router-redux'
import { getCurrentTimeframe } from '../reducers/selectors'
import { changeTimeframe } from '../actions/playlist'

const TIMEFRAMES = [ 7, 14, 30, 90 ]

class Navigation extends Component {
  constructor(props) {
    super(props)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange(e) {
    if (e.charCode === 13) {
      const { timeframe } = this.props
      const tag = e.currentTarget.value.trim()
      if (tag !== '') {
        // This probably shoudn't work like this, RTFM later
        this.props._push(`/songs/${tag}/${timeframe}`)
      }
    }
  }

  handleTimeframeChange(newTimeframe) {
    const { timeframe } = this.props
    if (timeframe !== newTimeframe) {
      this.props.changeTimeframe(newTimeframe)
    }
  }

  renderTimeframes() {
    const { timeframe } = this.props
    return TIMEFRAMES.map(item => (
      <div key={item}
        className={`searchbar-timeframes-option${timeframe === item ? ' searchbar-active' : ''}`}
        onClick={() => this.handleTimeframeChange(item)}>
        {item}
      </div>))
  }

  render() {
    return (
      <div className="header">
        <div className="logo">
          <div className="logo-icon">
            <span className="glyphicon glyphicon-bullhorn" />
          </div>
          <div className="logo-name">
            <a href="/songs"><h3>Sndcldplayer</h3></a>
          </div>
        </div>
        <div className="searchbar">
          <div className="searchbar-timeframes">
            {this.renderTimeframes()}
            <span className="searchbar-timeframes-label">days old</span>
          </div>
          <div className="searchbar-label">
            <span className="glyphicon glyphicon-search" />
          </div>
          <div className="searchbar-input">
            <input onKeyPress={this.handleInputChange} type="text" className="form-control" placeholder="Search" />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    timeframe: getCurrentTimeframe(state),
  }
}

export default connect(mapStateToProps, { _push, changeTimeframe })(Navigation)

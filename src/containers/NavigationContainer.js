import { connect } from 'react-redux'
import React, { Component } from 'react'
import { push } from 'react-router-redux'

class Navigation extends Component {
  constructor (props) {
    super(props)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange (e) {
    if (e.charCode === 13) {
      const { dispatch } = this.props
      let tag = e.currentTarget.value.trim()
      if (tag !== '') {
        // This probably shoudn't work like this, RTFM later
        dispatch(push(`/songs?q=${tag}&time=90`))
      }
    }
  }

  render () {
    return (
      <div className='header'>
        <div className='logo'>
          <div className='logo-icon'>
            <span className='glyphicon glyphicon-bullhorn'></span>
          </div>
          <div className='logo-name'>
            <a style={{color: 'white', textDecoration: 'none'}} href='/songs'><h3>Sndcldplayer</h3></a>
          </div>
        </div>
        <div className='searchbar'>
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

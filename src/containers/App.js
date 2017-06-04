import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setWidth } from '../actions/environmentActions'
import PlaylistContainer from './PlaylistContainer'
import NavigationContainer from './NavigationContainer'
import PlayerContainer from './PlayerContainer'

class App extends Component {
  componentWillMount () {
    const { dispatch } = this.props
    dispatch(setWidth(window.innerWidth))
  }

  renderContent () {
    const { location } = this.props.router
    switch (location.pathname) {
      case ('/songs'):
        return <PlaylistContainer />
      default:
        return <div><h1>Sorry, 404, plz do not hurt me</h1></div>
    }
  }

  render () {
    return (
      <div className='container'>
        <NavigationContainer />
        {this.renderContent()}
        <PlayerContainer />
      </div>
    )
  }
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(App)

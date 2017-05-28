import React, { Component } from 'react'
import { connect } from 'react-redux'
import PlaylistContainer from './PlaylistContainer'
import NavigationContainer from './NavigationContainer'
import PlayerContainer from './PlayerContainer'

class App extends Component {
  renderContent () {
    const { location } = this.props.router
    switch (location.pathname) {
      case ('/songs'):
        return <PlaylistContainer />
      default:
        return <div><h1>Sorry, 404, plz don't hurt me</h1></div>
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

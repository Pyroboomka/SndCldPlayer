import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push as _push } from 'react-router-redux'
import { updateEnvironment } from '../actions/environment'
import PlaylistContainer from './PlaylistContainer'
import NavigationContainer from './NavigationContainer'
import PlayerContainer from './PlayerContainer'

class App extends Component {
  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions)
    this.props.updateEnvironment(window.innerWidth, window.innerHeight);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions)
  }

  updateDimensions = () => {
    this.props.updateEnvironment(window.innerWidth, window.innerHeight);
  }

  render() {
    return (
      <div className="container-fluid">
        <NavigationContainer />
        <PlaylistContainer match={this.props.match} />
        <PlayerContainer />
      </div>
    )
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    state,
    ownProps,
  }
}

export default connect(mapStateToProps, { updateEnvironment, _push })(App)

import React from 'react'
import Song from '../Song'
import Spinner from '../Spinner'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { InfiniteLoader, List } from 'react-virtualized'
import { getSongsGrid, getNextHref, getPlayingPlaylist } from '../../reducers/selectors'
import { fetchMoreSongs } from '../../actions/playlist'
import './styles.css'

class Songs extends React.Component {
  fetchSongs = (playlist, { startIndex, stopIndex }) => {
    const { songsGrid } = this.props
    if (songsGrid.length <= stopIndex) {
      this.props.fetchMoreSongs(playlist)
    }
    // "2 песни на ряд"
    // if (startIndex > songsGrid.length && stopIndex <= songsGrid.length) {
    //   this.props.fetchMoreSongs(playlist)
    // }
  }

  rowRenderer = ({ index, key, style }) => {
    const { songsGrid } = this.props
    const rowToRender = songsGrid[index]
    if (!this.isRowLoaded(index)) {
      return (
        <div style={style} key={key} className="row justify-content-md-center">
          <Spinner isSpinning={true} />
        </div>
      )
    }
    return (
      <div style={style} key={key} className="row">
        {rowToRender.map(id => (
          <div key={id} className="col">
            <Song
              id={id}
              playlist={this.props.playlist}
            />
          </div>
        ))}
      </div>
    )
  }

  isRowLoaded = (item) => {
    if (typeof item === 'object') {
      return !this.props.hasNextPage || item.index < this.props.songsGrid.length
    }
    return !this.props.hasNextPage || item < this.props.songsGrid.length
  }

  render() {
    console.log(this.props)
    const { songsGrid, playlists, playlist, hasNextPage, isPlayerActive } = this.props
    const rowCount = hasNextPage ? songsGrid.length + 1 : songsGrid.length
    const isNextPageLoading = !(playlist in playlists) || playlists[playlist].isFetching
    const loadMoreRows = isNextPageLoading ? () => {} : (indexes) => this.fetchSongs(playlist, indexes)
    return (
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={loadMoreRows}
          rowCount={rowCount}
          threshold={3}
        >
          {({ onRowsRendered, registerChild }) => (
              <List
                className="playlist-list"
                width={this.props.env.width - 30}
                height={isPlayerActive ? this.props.env.height - 100 : this.props.env.height - 50 }
                rowCount={rowCount}
                ref={registerChild}
                onRowsRendered={onRowsRendered}
                rowRenderer={this.rowRenderer}
                rowHeight={145}
              />
            )}
        </InfiniteLoader>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { playlist } = ownProps
  const songsGrid = getSongsGrid(state, playlist)
  const nextHref = getNextHref(state, playlist)
  return {
    songsGrid,
    playlist,
    hasNextPage: nextHref !== null,
    ...ownProps,
    env: state.environment,
    isPlayerActive: getPlayingPlaylist(state) !== '',
  }
}

export default connect(mapStateToProps, { fetchMoreSongs })(Songs)

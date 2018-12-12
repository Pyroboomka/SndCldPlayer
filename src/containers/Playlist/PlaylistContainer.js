import { connect } from 'react-redux'
import React, { Component } from 'react'
import Song from '../../components/Song'
import { FixedSizeList } from 'react-window'
import { fetchMoreSongs, fetchPlaylistIfNeeded } from '../../actions/playlist'
import { getNextHref, getPlayingPlaylist, getSongsList } from '../../reducers/selectors'
import './styles.css'

class Playlist extends Component {
  container = React.createRef()

  componentDidMount() {
    // this.container.current.addEventListener('scroll', this.handleScroll)
    console.log(this.container.current)
    const { playlists, playlist, timeframe } = this.props
    if (!(playlist in playlists)) {
      this.props.fetchPlaylistIfNeeded(playlist, timeframe)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { playlist } = this.props
    if (playlist !== nextProps.playlist) {
      this.props.fetchPlaylistIfNeeded(nextProps.playlist, nextProps.timeframe)
    }
  }

  componentDidUpdate() {
    // const lastSong = this.container.current.lastChild
    // if (lastSong) {
    //   const offset = lastSong.offsetTop + lastSong.clientHeight
    //   const currentHeight = this.props.env.height
    //   if (currentHeight - offset > 100 && this.props.nextHref && !this.props.isFetching) {
    //     this.props.fetchMoreSongs(this.props.playlist)
    //   }
    // }
  }

  handleScroll = e => {
    const data = this.container.current
    if (!this.props.nextHref || this.props.isFetching) return
    const { scrollHeight, scrollTop, clientHeight } = data
    const scrolledToTheEnd = scrollTop + clientHeight === scrollHeight
    if (scrolledToTheEnd) {
      this.props.fetchMoreSongs(this.props.playlist)
    }
    // TODO: uncomment this crap.
    // if (scrollTop + clientHeight + 100 < scrollHeight ) return;
    // console.log('3 values', scrollHeight, scrollTop, clientHeight);
    // if ((scrollTop + clientHeight - scrollHeight) < 50) {
    //   this.props.fetchMoreSongs(this.props.playlist)
    // }
  }

  render() {
    // return (
    //   <div ref={this.container} className="songsContainer">
    //     {this.props.songsList.map(id => <Song key={id} id={id} playlist={this.props.playlist} />)}
    //   </div>
    // )
    return (
      <FixedSizeList height={this.props.playlistHeight} itemSize={120} itemCount={this.props.songsList.length} itemData={this.props.songsList}>
        {({ index, data, style }) => (
          <div style={style}>
            <Song key={index} id={data[index]} playlist={this.props.playlist} />
          </div>
        )}
      </FixedSizeList>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { query, timeframe } = ownProps.match.params
  const playlist = query + timeframe
  const songsList = getSongsList(state, playlist)
  const nextHref = getNextHref(state, playlist)
  const { playlists, player, environment } = state
  const isPlayerActive = player.isPlaying || player.currentPlaylist !== ''
  const playlistHeight = isPlayerActive ? environment.height - 100 : environment.height - 50
  return {
    playlistHeight,
    env: environment,
    songsList,
    nextHref,
    playlists,
    playlist: query + timeframe,
    timeframe,
    isFetching: state.playlists[playlist] ? state.playlists[playlist].isFetching : true,
    isPlayerActive: getPlayingPlaylist(state) !== '',
  }
}

export default connect(
  mapStateToProps,
  { fetchPlaylistIfNeeded, fetchMoreSongs }
)(Playlist)

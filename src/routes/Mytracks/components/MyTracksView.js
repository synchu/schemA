import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { List, Navigation } from 'react-toolbox'
import Input from 'react-toolbox/lib/input'
import SongItem from '../../../components/SongItem'
import Infinite from 'react-infinite'
import trackObject from '../interfaces/track.js'
import classes from './MyTracksView.scss'
import classNames from 'classnames'

export class MyTracksView extends Component {

  static propTypes = {
    tracksCount: PropTypes.number,
    loadMoreTracks: PropTypes.func,
    tracks: PropTypes.array,
    isAuthenticated: PropTypes.bool.isRequired,
    loadTracks: PropTypes.func,
    renderItem: PropTypes.func
  }

  constructor (props) {
    super(props)
    // local state stuff
    // this.state = {}
  }

  renderItem (item: trackObject) {
    return (
      <SongItem key={item.id}
        item={{
          avatar_url: item.avatar_url, src: item.src, author: item.author,
          trackName: item.trackName, playCount: item.playCount
        }} />
    )
  }

  componentDidMount () {
    this.props.loadTracks('me')
  }

  render () {
    const { isAuthenticated, tracks } = this.props
    return (
      <div>
        <div>
          <h2> My tracks </h2>
        </div>
        <div>
          <List selectable>
            {isAuthenticated &&
              tracks.map(this.renderItem)
            }
          </List>
        </div>
        <div>
          <Navigation
            type='horizontal'
            theme={classes}
            onClick={(event, instance) => {

            }
            }
            onTimeout={(event) => {

            }
            }
            >
            <List>
              <SongItem item={{ avatar_url: 'testAvatar', src: 'sscc', author: 'synchu', trackName: 'Sample track', playCount: 4, selectable: false }} />
            </List>
          </Navigation>
        </div>
      </div>
    )
  }
}

export default MyTracksView

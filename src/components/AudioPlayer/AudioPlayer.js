import React, { PropTypes } from 'react'
import { withMediaPlayer, withMediaProps, controls, utils } from 'react-media-player'
import PlayPause from './PlayPause'
import MuteUnmute from './MuteUnmute'
import { Navigation } from 'react-toolbox'
import classes from './AudioPlayer.scss'
import classNames from 'classnames'

const { CurrentTime, Progress, SeekBar, Duration, Volume } = controls
const { formatTime } = utils

class AudioPlayer extends React.Component {

  render() {
    const { Player, media } = this.props
    const { isLoading, playPause, currentTime, duration } = media
    return (
      <div>
        {isLoading && <span>Loading...</span>}
        <div onClick={() => playPause()}>
          {Player}
        </div>
        <Navigation type='horizontal' className={classes.mediacontrols}>
          <PlayPause className={classNames(classes.mediacontrol, classes.playpause) } />
          <CurrentTime className={classNames(classes.mediacontrol, classes.mediacontrol_currentime) }  />
          <SeekBar className={classNames(classes.mediacontrol, classes.mediacontrol_seekbar) } />
          <Duration className={classNames(classes.mediacontrol, classes.playpause) } />
          <div className={classNames(classes.mediacontrolgroup) }>
            <MuteUnmute className={classNames(classes.mediacontrol, classes.playpause) } />
            <Volume className={classNames(classes.mediacontrol, classes.playpause) } />
          </div>
        </Navigation>
      </div>
    )
  }

}

export default withMediaPlayer(withMediaProps(AudioPlayer), 'audio')

import React from 'react'
import {IconButton, Tooltip} from 'react-toolbox'
import MediaQuery from 'react-responsive'
import classes from './HomeView.scss'

export const renderStatItem = (brandItem, index, tooltip, icon) => {
  const TTStats = Tooltip(IconButton)
  return (
    <span className={classes.statsFontScale}>
      <MediaQuery minDeviceWidth={767}>
        <TTStats
          icon={icon}
          tooltip={tooltip}
          style={{width: '24px', height: '24px'}}
          >
          {<span style={{marginRight: 'auto', padding: 0, fontSize: '1.2rem', marginTop: 'auto', zIndex: '2'}}> {
            brandItem[index]
          } </span>}
        </TTStats>
      </MediaQuery>
      <MediaQuery maxDeviceWidth={766} />
    </span>
  )
}

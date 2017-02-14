import React from 'react'
import {IconButton, Tooltip} from 'react-toolbox'
import MediaQuery from 'react-responsive'
import classes from './HomeView.scss'

export const renderStatItem = (brandItem, index, tooltip, icon) => {
  const TTStats = Tooltip(IconButton)
  return (
    <span>
      <MediaQuery minDeviceWidth={767}>
        <TTStats
          primary
          icon={icon}
          tooltip={tooltip}
          theme={classes}
          className={classes.statsFontScale}>
          {<span> {
            brandItem[index]
          } </span>}
        </TTStats>
      </MediaQuery>
      <MediaQuery maxDeviceWidth={766}/>
    </span>
  )
}

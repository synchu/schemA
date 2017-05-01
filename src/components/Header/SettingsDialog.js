import PropTypes from 'prop-types';
import React from 'react';
import {Dialog, Switch, Button} from 'react-toolbox'
//import classes from './HomeView.scss'

export const SettingsDialog = (props) => {
  var visible = true
  var classes = {}
  const {handleSettings, toggleSettings, currentSettings} = props

  const handleVisibility = () => {
    visible = false
    toggleSettings()
  }

  return (
    <Dialog
      active={visible}
      onEscKeyDown={handleVisibility}
      onOverlayClick={handleVisibility}
      title='Application settings'>
      <Switch
        theme={classes}
        checked={currentSettings.modelsAsList}
        label='Models as list'
        onChange={(e) => handleSettings(e, 'models')} />
      <p>Toggles models display in Models selection pane</p>
      <Switch
        theme={classes}
        checked={currentSettings.cardsAsList}
        label='Cards as list'
        onChange={(e) => handleSettings(e, 'cards')} />
      <p>Toggles models display as list in View pane</p>
      <Switch
        theme={classes}
        checked={currentSettings.showStats}
        label='Show stats'
        onChange={(e) => handleSettings(e, 'stats')} />
      <p>Toggles brand statistics display in Models selection pane. <i>Temporarily disabled</i></p>
      <Switch
        theme={classes}
        checked={currentSettings.typesAsPictures}
        label='Types as pictures'
        onChange={(e) => handleSettings(e, 'types')} />
      <p>Toggles file types display as picture or text.</p>
      <Button
        style={{
          display: 'flex',
          marginLeft: 'auto'
        }}
        accent
        label='Close'
        onClick={handleVisibility} />
    </Dialog>
  )
}

SettingsDialog.propTypes = {
  settingsActive: PropTypes.bool,
  handleSettings: PropTypes.func.isRequired,
  toggleSettings: PropTypes.func.isRequired,
  currentSettings: PropTypes.object
}

export default SettingsDialog

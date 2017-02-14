import React, {PropTypes} from 'react'
import {Dialog, Button} from 'react-toolbox'

export const HelpDialog = (props) => {
  var visible = true

  const {toggleHelp} = props

  const handleVisibility = () => {
    visible = false
    toggleHelp()
  }

  return (
    <Dialog
      active={visible}
      onEscKeyDown={handleVisibility}
      onOverlayClick={handleVisibility}
      title='SchemA application usage help'>
      <p>
      SchemA has been designed to be easy and straightforward to use.
      Some guidance to its features is provided here to aid uncovering its full functionality.
      </p>
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

HelpDialog.propTypes = {
  helpActive: PropTypes.bool,
  toggleHelp: PropTypes.func.isRequired
}

export default HelpDialog

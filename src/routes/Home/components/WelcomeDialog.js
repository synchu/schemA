import React, { PropTypes } from 'react'
import { Dialog, Switch, Button } from 'react-toolbox'
import classes from './HomeView.scss'

export const WelcomeDialog = (props) => {
    const { welcomeActive, handleWelcome } = props
    let switchValue = !welcomeActive

    return (
        <Dialog
            active={welcomeActive}
            onEscKeyDown={() => handleWelcome(false, 'from_dlg')}
            onOverlayClick={() => handleWelcome(false, 'from_dlg')}
            title='Welcome to SchemA'
            >
            <p>SchemA is <a href='http://diyguitaramps.prophpbb.com/' target='_blank'>http://diyguitaramps.prophpbb.com/</a> supported
      (mostly) guitar tube amps schematics, layouts, build photos and other useful documents archive.
        <br />In order to provide this archive application functionality, we do store some data on your local device. Should you disagree, please, leave this web page.
        <br />Please, make sure to read our privacy policy and terms of use to find out more.</p>
            <Switch theme={classes}
                checked={switchValue}
                label='Do not show again'
                onChange={(e, value) => handleWelcome(!e, 'from_switch')} />
            <Button style={{ display: 'flex', marginLeft: 'auto' }} accent label='Close' onClick={() => handleWelcome(false, 'from_dlg')} />
        </Dialog>
    )
}

WelcomeDialog.propTypes = {
    welcomeActive: PropTypes.bool,
    handleWelcome: PropTypes.func.isRequired
}

export default WelcomeDialog

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {Dialog, Button, Tabs, Tab} from 'react-toolbox'
import {InlineContent, EditCreateContent, UploadGeneralContent} from '../HelpContents/HelpContents'
import classes from './HelpDialog.scss'

export class UploadDialogHelp extends Component {
  visible = true
  static propTypes = {
    helpActive: PropTypes.bool,
    toggleHelp: PropTypes.func.isRequired
  }
  state = {
    index: 0
  }

  constructor (props) {
    super(props)
    this.visible = true
  }

  handleVisibility = () => {
    this.visible = false
    this
      .props
      .toggleHelp()
  }

  handleTabChange = (index) => {
    this.setState({index})
  }

  handleFixedTabChange = (index) => {
    this.setState({fixedIndex: index})
  }

  handleInverseTabChange = (index) => {
    this.setState({inverseIndex: index})
  }

  handleActive = () => {
    console.log('Special one activated')
  }

  render = () => {
    return (
      <Dialog
        active={this.visible}
        theme={classes}
        large
        onEscKeyDown={this.handleVisibility}
        onOverlayClick={this.handleVisibility}
        title='SchemA application usage help'
        style={{
          overflow: 'auto',
          height: '90%'
        }}>
        <div
          style={{
            overflow: 'auto',
            minHeight: '80%',
            maxHeight: '90%'
          }}>
          <div>
            <strong>SchemA</strong> implements two features, allowing editing and uploading information:
            <ul>
              <li>Edit/Create amp item dialog</li>
              <li>Inline editing within amplifier version item card</li>
            </ul>
            You cannot edit information in table view mode.
            <br />
            <br />
            You must be logged and appropriately authorized in order to edit/create, inline edit amplifier information.
          </div>
          <br />
          <section>
            <Tabs index={this.state.index} onChange={this.handleTabChange}>
              <Tab label='General'>
                <UploadGeneralContent />
              </Tab>
              <Tab label='Edit/Create amp item'>
                <EditCreateContent />
              </Tab>
              <Tab label='Inline Card Editing'>
                <InlineContent />
              </Tab>
            </Tabs>
          </section>
          <Button
            style={{
              display: 'flex',
              marginLeft: 'auto',
              marginBottom: '10px'
            }}
            accent
            label='X'
            onClick={this.handleVisibility} />
        </div>
      </Dialog>
    )
  }
}

export default UploadDialogHelp

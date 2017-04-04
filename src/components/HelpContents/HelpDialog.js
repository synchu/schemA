import React, {PropTypes, Component} from 'react'
import {Dialog, Button, Tabs, Tab} from 'react-toolbox'
import {SearchContent, SideNavigation, TopMenuContent,
AppSettingsContent, GeneralContent} from '../HelpContents/HelpContents'
import classes from './HelpDialog.scss'

export class HelpDialog extends Component {
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
            <strong>SchemA</strong> has been designed to be easy and straightforward to use. Some guidance to
            its features is provided here to aid uncovering its full functionality. (in
            progress)
          </div>
          <section>
            <Tabs index={this.state.index} onChange={this.handleTabChange}>
              <Tab label='General'>
                <GeneralContent />
              </Tab>
              <Tab label='Top menu'>
                <TopMenuContent />
              </Tab>
              <Tab label='Side navigation' onActive={this.handleActive}>
                <SideNavigation />
              </Tab>
              <Tab label='Cards features(?)'>
                <small>In progress</small>
              </Tab>
              <Tab label='List features(?)'>
                <small>In progress</small>
              </Tab>
              <Tab label='Search'>
                <SearchContent />
              </Tab>
              <Tab label='Settings'>
                <AppSettingsContent />
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

export default HelpDialog

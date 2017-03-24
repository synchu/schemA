import React, {PropTypes, Component} from 'react'
import {Dialog, Button, Tabs, Tab} from 'react-toolbox'

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
        onEscKeyDown={this.handleVisibility}
        onOverlayClick={this.handleVisibility}
        title='SchemA application usage help'>
        <div>
          SchemA has been designed to be easy and straightforward to use. Some guidance to
          its features is provided here to aid uncovering its full functionality. (in
          progress)
        </div>
        <section>
          <Tabs index={this.state.index} onChange={this.handleTabChange}>
            <Tab label='Top menu'>
              <small>Primary content</small>
            </Tab>
            <Tab label='Side navigation' onActive={this.handleActive}>
              <small>Secondary content</small>
            </Tab>
            <Tab label='Cards features'>
              <small>Disabled content</small>
            </Tab>
            <Tab label='List features'>
              <small>Fourth content hidden</small>
            </Tab>
            <Tab label='Search'>
              <small>Fifth content</small>
            </Tab>
          </Tabs>

        </section>
        <Button
          style={{
            display: 'flex',
            marginLeft: 'auto'
          }}
          accent
          label='Close'
          onClick={this.handleVisibility} />
      </Dialog>
    )
  }
}

export default HelpDialog

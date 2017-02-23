import React, {Component, PropTypes} from 'react'
import {IndexLink, Link} from 'react-router'
import {IconButton, Button, AppBar, Autocomplete, Snackbar} from 'react-toolbox'
import Logo from '../Logo'
import {push} from 'react-router-redux'
import MediaQuery from 'react-responsive'
import SettingsDialog from './SettingsDialog'
import HelpDialog from './HelpDialog'
import classes from './Header.scss'

export class Header extends Component {
  state = {
    multiple: '',
    renderSnack: true,
    settingsVisible: false
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    dispatch: PropTypes.func,
    loginErrorMsg: PropTypes.string,
    router: PropTypes.object,
    drawer: PropTypes.object,
    navbarPinned: PropTypes.bool,
    navbarActive: PropTypes.bool,
    setNavbarActive: PropTypes.func,
    setNavbarPinned: PropTypes.func,
    loadAmpsVersions: PropTypes.func,
    ampVersions: PropTypes.object,
    selectBrand: PropTypes.func,
    selectModel: PropTypes.func,
    loadModels: PropTypes.func,
    loadItem: PropTypes.func,
    handleSettings: PropTypes.func,
    currentSettings: PropTypes.object,
    toggleSearching: PropTypes.func,
    logoutUser: PropTypes.func,
    loginUser: PropTypes.func,
    requestLogin: PropTypes.func,
    auth: PropTypes.object,
    isAdmin: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.handleClick = this
      .handleClick
      .bind(this)
    this.changeNavDrawerVisibility = this
      .changeNavDrawerVisibility
      .bind(this)
    this.hideSnack = this
      .hideSnack
      .bind(this)
  }

  handleClick = (e) => {
    // console.log(e.target.id)
  }

  hideSnack = (e) => {
    this.setState({
      ...this.state,
      renderSnack: false
    })
  }

  toggleSettings = () => {
    this.setState({...this.state, settingsVisible: !this.state.settingsVisible})
  }

  toggleHelp = () => {
    this.setState({...this.state, helpVisible: !this.state.helpVisible})
  }

  changeNavDrawerVisibility = (e) => {
    const {navbarPinned, navbarActive, setNavbarActive, setNavbarPinned} = this.props

    let mql = window.matchMedia('(min-width: 450px)')

    if (!mql.matches) {
      setNavbarPinned(false)
      setNavbarActive(!navbarActive)
    } else {
      setNavbarPinned(!navbarPinned)
      setNavbarActive(false)
    }
  }

  handleMultipleChange = (value) => {
    const {ampVersions, selectBrand, loadModels, selectModel, loadItem, toggleSearching} = this.props
    this.setState({multiple: value})
    let selected = ampVersions[value].split(', ')
    toggleSearching()
    selectBrand(selected[2])
    loadModels()
    selectModel(selected[1])
    loadItem()
    
    setTimeout(() => this.setState({multiple: ''}), 1500)
    // auto scroll to the element- after it is presumably loaded
    setTimeout(() => {
      let element = document.getElementById(selected[2].trim())
      if (element) {
        element.scrollIntoViewIfNeeded()
      }
    }, 1500)
    setTimeout(() => {
      let element = document.getElementById(selected[0].trim())
      if (element) {
        element.scrollIntoViewIfNeeded()
      }
    }, 1500)
  }

  componentDidMount () {
    this
      .props
      .loadAmpsVersions()
  }


  render () {
    const {loginErrorMsg, isAuthenticated, isAdmin, ampVersions, requestLogin, dispatch, auth} = this.props
    return (
      <div>
        <AppBar fixed flat type='horizontal' theme={classes}>
          <IconButton
            icon='menu'
            title='Open Brands selection...'
            inverse
            onClick={this.changeNavDrawerVisibility} />
          <IndexLink to='/' activeClassName={classes.activeRoute}>
            <div className={classes.logo}>
              <Logo
                title='SchemA - the ultimate tube amps schematics archive'
                width='782'
                height='182'
                scale={(0.2 * Math.max(0.35, screen.width / 1980)).toString()} />
            </div>
          </IndexLink>
          <MediaQuery minDeviceWidth={768}>
            <div
              style={{
                display: 'flex',
                marginLeft: 'auto'
              }}>
              {!isAuthenticated && <div>
                <Link
                  to='/login'
                  activeClassName={classes.activeRoute}
                  onClick={(e) => {
                    e.preventDefault()
                    requestLogin(auth)
                  }}>
                  <IconButton icon='account_box' title='login' id='login' inverse />
                </Link>
                {loginErrorMsg && <span>loginErrorMsg</span>}
              </div>}
              {isAuthenticated && isAdmin() && <div>
                <Link to='/upload' activeClassName={classes.activeRoute}>
                  <IconButton icon='file_upload' title='Upload' id='upload' inverse onClick={this.handleClick} />
                </Link>
              </div>}
              {isAuthenticated && <div>
                {' · '}
                <Link to='/' activeClassName={classes.activeRoute}>
                  <IconButton
                    icon='exit_to_app'
                    title='Logout'
                    id='logout'
                    inverse
                    onClick={() => {
                      this.props.logoutUser()
                    }
                  } />
                </Link>
              </div>
}
            </div>
          </MediaQuery>

          <div
            style={{
              minWidth: '5rem'
            }}>
            <span
              style={{
                display: 'flex',
                flexFlow: 'row nowrap'
              }}>
            
              <Autocomplete
                type='search'
                hint='Type to search...'
                direction='down'
                icon='search'
                className={classes.searchInput}
                source={ampVersions}
                multiple={false}
                value={this.state.multiple}
                onChange={this.handleMultipleChange}
                theme={classes}
                suggestionMatch='anywhere' />
              <IconButton
                title='Click to clear...'
                inverse
                style={{
                  margin: 'auto',
                  fontSize: '1.3rem'
                }}
                icon='clear'
                onClick={() => this.setState({multiple: ''})}/>
              <IconButton
                style={{margin: 'auto', marginLeft: 'auto'}}
                icon='settings'
                title='Settings'
                inverse
                onClick={this.toggleSettings} />
               {this.state.settingsVisible &&
                 <SettingsDialog
                   handleSettings={this.props.handleSettings}
                   toggleSettings={this.toggleSettings}
                   currentSettings={this.props.currentSettings} />}
              <IconButton
                style={{margin: 'auto', marginLeft: 'auto'}}
                icon='help'
                title='Help'
                inverse
                onClick={this.toggleHelp} />
                {this.state.helpVisible &&
                  <HelpDialog
                    toggleHelp={this.toggleHelp} />}
            </span>
          </div>
        </AppBar>
        <div>
          <Snackbar
            className={classes.snack}
            action='X'
            icon='menu'
            label={'click or tap the top left Menu button to toggle Amps brands navigation menu'}
            active={this.state.renderSnack}
            onTimeout={this.hideSnack}
            onClick={this.hideSnack}
            timeout={2500}
            ref='snackbar'
            type='accept' />
        </div>
      </div>
    )
  }
}

export default Header

import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import { IconButton, Button, AppBar, Autocomplete, Snackbar } from 'react-toolbox'
import { logoutUser } from '../../routes/Login/modules/loginUser'
import Logo from '../Logo'
import MediaQuery from 'react-responsive'
import classes from './Header.scss'

export class Header extends Component {
  state = { multiple: '', renderSnack: true }
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
    loadItem: PropTypes.func
  }
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.changeNavDrawerVisibility = this.changeNavDrawerVisibility.bind(this)
    this.hideSnack = this.hideSnack.bind(this)
  }

  handleClick = (e) => {
    // console.log(e.target.id)
  }

  hideSnack = (e) => {
    this.setState({...this.state, renderSnack: false})
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
  const { ampVersions, selectBrand, loadModels, selectModel, loadItem } = this.props
  this.setState({ multiple: value })
  let selected = ampVersions[value].split(', ')

  selectBrand(selected[2])
  loadModels()
  selectModel(selected[1])
  loadItem()
  setTimeout(
    () => this.setState({ multiple: '' }),
    1500
  )
  // auto scroll to the element- after it is presumably loaded
  // promise based implementation would have been much better (after items are loaded)
  setTimeout(
    () => {
      let element = document.getElementById(selected[0].trim())
      if (element) {
        element.scrollIntoViewIfNeeded()
      }
    },
    1500
  )
}

componentDidMount() {
  this.props.loadAmpsVersions()
}

render() {
  const { loginErrorMsg, isAuthenticated, dispatch, ampVersions } = this.props

  return (
    <div>
      <AppBar fixed flat type='horizontal' theme={classes}>
        <IconButton icon='menu' title='Open Brands selection...' inverse onClick={this.changeNavDrawerVisibility} />
        <IndexLink to='/' activeClassName={classes.activeRoute}>
          <div className={classes.logo}>
            <Logo title='SchemA - the ultimate tube amps schematics archive' width='782' height='182' scale={(0.2 * Math.max(0.35, screen.width / 1980)).toString()} />
          </div>
        </IndexLink>
        <MediaQuery minDeviceWidth={768}>
          <div style={{ display: 'flex' }}>
            {isAuthenticated &&
              <div>
                <Link to='/upload' activeClassName={classes.activeRoute}>
                  <Button label='Upload' id='upload' inverse flat onClick={this.handleClick} />
                </Link>
              </div>
            }
            {!isAuthenticated && false &&
              <div>
                {' · '}
                <Link to='/login' activeClassName={classes.activeRoute} onClick={(e) => e.preventDefault()}>
                  <Button disabled label='Login' id='login' raised inverse flat />
                </Link>
                {loginErrorMsg && <span>loginErrorMsg</span>}
              </div>
            }
            {isAuthenticated &&
              <div>
                {' · '}
                <Link to='/' activeClassName={classes.activeRoute}>
                  <Button label='Logout' id='logout' raised inverse flat onClick={() => { dispatch(logoutUser()) } } />
                </Link>
              </div>
            }
          </div>
        </MediaQuery>

        <div style={{ marginLeft: 'auto', minWidth: '26rem' }}>
          <span style={{ display: 'flex', flexFlow: 'row nowrap' }}>
            <Autocomplete type='search' hint='Type to search versions...'
              direction='down'
              icon='search' className={classes.searchInput}
              source={ampVersions}
              multiple={false}
              value={this.state.multiple}
              onChange={this.handleMultipleChange}
              theme={classes}
              suggestionMatch='anywhere'
              />
            <IconButton title='Click to clear...' inverse style={{ margin: 'auto', fontSize: '1.3rem' }} icon='clear' onClick={() => this.setState({ multiple: '' })} />
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
          type='accept'
          />
      </div>
    </div>
  )
}
}

export default Header

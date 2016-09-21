import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import { IconButton, Button, AppBar, Input, Autocomplete } from 'react-toolbox'
import {logoutUser} from '../../routes/Login/modules/loginUser'
import Logo from '../Logo'
import MediaQuery from 'react-responsive'
import classes from './Header.scss'

export class Header extends Component {
  state = { multiple: '' }
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
  }

  handleClick = (e) => {
    // console.log(e.target.id)
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
    let selected = ampVersions[value].split(' ')

    selectBrand(selected[2])
    loadModels()
    selectModel(selected[1])
    loadItem()
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
          <MediaQuery minDeviceWidth={768}>
            <div style={{ display: 'flex' }}>
              <IndexLink to='/' activeClassName={classes.activeRoute}>
                <Button label='Home' id='home' inverse onClick={this.handleClick} />
              </IndexLink>
              {isAuthenticated &&
                <div>
                  <Link to='/upload' activeClassName={classes.activeRoute}>
                    <Button label='Upload' id='upload' inverse flat onClick={this.handleClick} />
                  </Link>
                </div>
              }
              {!isAuthenticated &&
                <div>
                  {' · '}
                  <Link to='/login' activeClassName={classes.activeRoute}>
                    <Button disabled label='Login' id='login' raised inverse flat onClick={this.handleClick} />
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
          <div className={classes.logo}>
            <Logo title='SchemA - the ultimate tube amps schematics archive' width='782' height='182' scale={(0.3 * screen.width / 1980).toString() } />
          </div>
          <div style={{ marginLeft: 'auto' }}>
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
              <IconButton title='Click to clear...' inverse style={{ margin: 'auto', fontSize: '1.3rem' }}icon='clear' onClick={() => this.setState({ multiple: '' }) } />
            </span>
          </div>
        </AppBar>
      </div >
    )
  }
}

export default Header

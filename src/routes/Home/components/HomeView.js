import React, {Component, PropTypes} from 'react'
import classes from './HomeView.scss'
import Header from '../../../components/Header'
import Profile from '../../../components/Profile'
import ModelItem from '../../../components/ModelItem'
import SocialShare from '../../../components/SocialShare'
import {
  Snackbar,
  List,
  Panel,
  NavDrawer,
  Layout,
  ListItem,
  IconButton,
  Chip,
  FontIcon
} from 'react-toolbox'
import {Input} from 'react-toolbox/lib/input'
import {clearMessage} from '../../Login/modules/loginUser'
import MediaQuery from 'react-responsive'
import {renderStatItem} from './Stats'
import WelcomeDialog from './WelcomeDialog'
import cn from 'classnames'

export class HomeView extends Component {
  singleModel = false
  state = {
    loggedout: false,
    invisibleChip: false,
    modelsAsList: false,
    cardsAsList: false,
    showStats: true,
    welcomeActive: true
  }

  static propTypes = {
    routes: PropTypes.array,
    snackMessage: PropTypes.string,
    dispatch: PropTypes.func,
    loadBrands: PropTypes.func,
    loadModels: PropTypes.func,
    selectBrand: PropTypes.func,
    isAuthenticated: PropTypes.bool,
    brands: PropTypes.array,
    filteredBrand: PropTypes.string,
    filteredModels: PropTypes.string,
    selectedBrand: PropTypes.string,
    filterBrand: PropTypes.func,
    filterModels: PropTypes.func,
    loadItem: PropTypes.func,
    selectModel: PropTypes.func,
    models: PropTypes.array,
    isFetching: PropTypes.bool,
    item: PropTypes.arrayOf(Object),
    navbarActive: PropTypes.bool,
    navbarPinned: PropTypes.bool,
    setNavbarActive: PropTypes.func,
    ampVersions: PropTypes.object,
    loadAmpsVersions: PropTypes.func,
    selectedModel: PropTypes.string,
    setNavbarPinned: PropTypes.func,
    isFetchingModels: PropTypes.bool,
    observableFetch: PropTypes.func,
    loginUser: PropTypes.func,
    logoutUser: PropTypes.func,
    requestLogin: PropTypes.func,
    roles: PropTypes.array,
    picture: PropTypes.string,
    username: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.state.cardsAsList = JSON.parse(localStorage.getItem('cards_as_list')) || false
    this.state.modelsAsList = JSON.parse(localStorage.getItem('models_as_list')) || false
    this.state.typesAsPictures = JSON.parse(localStorage.getItem('types_as_pictures')) || true
    this.state.showStats = JSON.parse(localStorage.getItem('show_stats')) === null
      ? false
      : JSON.parse(localStorage.getItem('show_stats'))
    this.state.welcomeActive = JSON.parse(localStorage.getItem('welcome_active')) === null
      ? true
      : JSON.parse(localStorage.getItem('welcome_active'))
  }

  updateShowLogout : void = () => this.setState({
    ...this.state,
    loggedout: !this.state.loggedout
  })

  handleChange = (value : string, item : Object) => {
    const {filterBrand, filterModels} = this.props
    if (item.target.name === 'filterBrand') {
      filterBrand(value)
    } else {
      filterModels(value)
    }
  }

  handleModelClicked = (item, e) => {
    const {loadItem, selectModel} = this.props
    localStorage.setItem('selected_model', item['1'])
    selectModel(item['1'])
    loadItem()
  }

  handleBrandClicked = (item, e) => {
    const {loadModels, selectBrand, selectModel, selectedBrand} = this.props

    if (selectedBrand && selectedBrand === item['0']) {
      return
    }

    localStorage.setItem('selected_brand', item['0'])
    selectBrand(item['0'])
    loadModels()
    // clear model and items selection
    selectModel('')
//    loadItem()
  }

  handleAddModelsArrow = (refString, isVisible) => {
    this.setState({
      ...this.state,
      invisibleChip: !isVisible
    })
  }

  renderModels = (model) => {
    const {selectedModel} = this.props
    let mc = this
      .handleModelClicked
      .bind(this, model)

    const key = 6
    if (this.singleModel) {
      mc(model, undefined)
    }

    return (
      <span key={model[key]}>
        {!this.state.modelsAsList && <Chip key={model[key]} onClick={mc} className={classes.modelChips}>
          {(selectedModel === model[1]) && <FontIcon
            className={classes.fontIconSelection}
            value='check' />}
          <span title='Click to view items'>
            <strong>{model[1]}</strong>
          </span>
          {false && <span className={classes.modelstats}>
            {renderStatItem(model, 2, 'No. of schematics', 'developer_board')}
            {renderStatItem(model, 4, 'No. of layouts', 'collections')}
            {renderStatItem(model, 3, 'No. of photos', 'photo')}
            {renderStatItem(model, 5, 'No. of other docs', 'attachment')}
          </span>}
        </Chip>
}
        {this.state.modelsAsList && <ListItem
          key={model[key]}
          caption={model[1]}
          className={classes.modelListItem}
          leftIcon={selectedModel === model[1]
          ? 'check'
          : ''}
          onClick={mc} />
}
      </span>
    )
  }


  renderBrands = (b) => {
    const {selectedBrand, models, filteredModels, isFetchingModels} = this.props
    const {modelsAsList, showStats} = this.state

    const key = 5


    if (b[0] === selectedBrand) {
      this.singleModel = false
    }

    let bc = this
      .handleBrandClicked
      .bind(this, b)

    return (
      <span key={b[key]} id={b[0]} ref={b[0]}>
        <MediaQuery minDeviceWidth={768}>
          <ListItem
            caption={b[0]}
            className={classes.brandItem}
            leftIcon={selectedBrand === b[0]
            ? 'star'
            : 'subject'}
            rightIcon={showStats
              ? <span className={classes.brandstats}>
                {renderStatItem(b, 1, 'No. of schematics', 'developer_board')}
                {renderStatItem(b, 3, 'No. of layouts', 'collections')}
                {/* renderStatItem(b, 2, 'No. of photos', 'photo')*/}
                {/* renderStatItem(b, 4, 'No. of other docs', 'attachment')*/}
              </span>
            : <span></span>}
            onClick={bc}
            />
          {(b[0] === selectedBrand) &&
            <div
              key={b[key]}
              className={classes.flexRowWrapLeft}>
            {modelsAsList && !isFetchingModels &&
              <List key={b[key]}>
                {(models) && models
                              .filter((i) => i[1].toLowerCase().indexOf(filteredModels.toLowerCase()) !== -1)
                              .map(this.renderModels)}
              </List>
            }
            {!modelsAsList && !isFetchingModels &&
              (models) && models
                           .filter((i) => i[1].toLowerCase().indexOf(filteredModels.toLowerCase()) !== -1)
                           .map(this.renderModels)
            }
            {isFetchingModels &&
              <FontIcon
                style={{
                  margin: 'auto'
                }}
                key={b[key]}
                value='hourglass_empty' />}
            </div>
        }
        </MediaQuery>
        <MediaQuery maxDeviceWidth={767}>
          <ListItem
            key={b[key]}
            caption={(selectedBrand === b[0]
            ? String.fromCharCode(10003) + ' ' + b[0]
            : b[0])}
            className={classes.brandItem}
            onClick={bc} />

            {(b[0] === selectedBrand) && <div
              className={classes.flexRowWrapLeft}>
            {modelsAsList && !isFetchingModels && <List>
              {(models) &&
                 models
                 .filter((i) => i[1]
                 .toLowerCase()
                 .indexOf(filteredModels.toLowerCase()) !== -1)
                 .map(this.renderModels)}
            </List>}
            {!modelsAsList && !isFetchingModels && (models) &&
                 models
                 .filter((i) => i[1]
                 .toLowerCase()
                 .indexOf(filteredModels.toLowerCase()) !== -1)
                 .map(this.renderModels)
            }
            {isFetchingModels && <FontIcon
              style={{
                margin: 'auto'
              }}
              key={b[key]}
              value='hourglass_empty' />}
            </div>}
        </MediaQuery>
      </span>
    )
  }

  renderFetching = () => {
    const hide = () => this
      .refs
      .loadingSnack
      .hide()
    return (<Snackbar
      theme={classes}
      active={this.state.loggedout}
      action='X'
      icon='done'
      type='warning'
      timeout={1000}
      label='Loading...'
      ref='loadingSnack'
      onClick={hide} />)
  }

  componentDidMount = () => {
    const {
      loadBrands,
      loadModels,
      selectBrand,
      setNavbarActive,
      setNavbarPinned,
      observableFetch
    } = this.props

    loadBrands()

    observableFetch()

    const selectedBrandLocal = localStorage.getItem('selected_brand')

    if (selectedBrandLocal) {
      selectBrand(selectedBrandLocal)
      loadModels()
    }

    this.updateShowLogout()

    let mql = window.matchMedia('(min-width: 450px)')
    if (!mql.matches) {
      setNavbarPinned(false)
      setNavbarActive(false)
    } else {
      setNavbarPinned(true)
    }
  }

  componentDidUpdate = (prevProps) => {
    const selectedBrandLocal = localStorage.getItem('selected_brand')
    var target = document.getElementById(selectedBrandLocal)
    if (target && target.scrollIntoViewIfNeeded) {
      target.scrollIntoViewIfNeeded({block: 'start', behavior: 'smooth'})
    }
  }


  localSetNavbarActive = () => {
    const {navbarActive, setNavbarActive} = this.props
    setNavbarActive(!navbarActive)
  }

  isAdmin = () => {
    const {roles} = this.props
    return (!!roles && roles.indexOf('admin') > -1)
  }

  handleSettings = (e, which) => {
    switch (which) {
      case 'models':
        localStorage.setItem('models_as_list', JSON.stringify(e))
        this.setState({
          ...this.state,
          modelsAsList: e
        })
        break
      case 'cards':
        localStorage.setItem('cards_as_list', JSON.stringify(e))
        this.setState({
          ...this.state,
          cardsAsList: e
        })
        break
      case 'stats':
        localStorage.setItem('show_stats', JSON.stringify(e))
        this.setState({
          ...this.state,
          showStats: e
        })
        break
      case 'types':
        localStorage.setItem('types_as_pictures', JSON.stringify(e))
        this.setState({
          ...this.state,
          typesAsPictures: e
        })
        break
      default:
        break
    }
  }

  render () {
    const {
      snackMessage,
      dispatch,
      brands,
      filterBrand,
      item
    } = this.props
    const {navbarPinned, navbarActive, isFetching, isAuthenticated, picture, username} = this.props
    let {filteredBrand, selectedBrand, selectedModel, loadItem} = this.props
    let {loginUser, logoutUser, requestLogin} = this.props

    return (
      <Layout className={classes.mainContainer}>
        <NavDrawer
          pinned={navbarPinned}
          active={navbarActive}
          theme={classes}
          clipped
          // width='normal'
          ref='navdrawer'>
          <div className={cn(classes.navigation, navbarPinned ? classes.expanded : '')}>
            <div className={classes.navtitle}>
              <div className={classes.flexRowWrap}>
                <Input
                  type='text'
                  hint='Type to filter brands'
                  label='Filter'
                  icon='filter_list'
                  className={classes.filterInputs}
                  name='filterBrand'
                  value={filteredBrand}
                  onChange={this.handleChange} />
                  {filteredBrand &&
                    <IconButton
                      icon='close'
                      onClick={() => filterBrand('')}
                      className={classes.filterBrandsButton}
                    />}
              </div>
            </div>
            <div className={classes.brands}>
              <List selectable>
                {(brands) && brands
                              .filter((i) => i[0].toLowerCase().indexOf(filteredBrand.toLowerCase()) !== -1)
                              .map(this.renderBrands)}
              </List>
            </div>
          </div>

          <footer></footer>
        </NavDrawer>

        <Panel bodyScroll>
          <WelcomeDialog welcomeActive={
            this.state.welcomeActive
              ? this.state.welcomeActive
              : false
          }
            handleWelcome={(e, type) => {
              if (type === 'from_switch') {
                localStorage.setItem('welcome_active', JSON.stringify(e))
              }
              this.setState({
                ...this.state,
                welcomeActive: e
              })
            }
          } />

          <Header
            isAuthenticated={isAuthenticated}
            isAdmin={this.isAdmin}
            dispatch={dispatch}
            className={classes.heading}
            drawer={this.refs.navdrawer}
            handleSettings={this.handleSettings}
            currentSettings={{modelsAsList: this.state.modelsAsList,
              cardsAsList: this.state.cardsAsList,
              showStats: this.state.showStats,
              typesAsPictures: this.state.typesAsPictures}}
            logoutUser={logoutUser}
            loginUser={loginUser}
            requestLogin={requestLogin}
            {...this.props} />
          <div className={cn(classes.content, navbarPinned ? classes.expanded : '')}>
            <div className={cn(classes.autoRow)}>
              <div
                style={{
                  display: 'flex',
                  color: 'blue'
                }}>
                THIS IS STILL A TEST!A lot of features may not yet work or may not work as
                expected, including the file links.
              </div>
              <div>
                {
                    isAuthenticated &&
                      <Profile title={username}
                        image={picture}
                        name={username}
                        isAdmin={this.isAdmin()} />
                }
              </div>
              <div className={classes.flexRightAuto}>
                <h4>{selectedBrand} - {selectedModel}</h4>
              </div>
              <div style={{
                flexFlow: 'row wrap',
                alignSelf: 'flex-start'
              }}>
                {isFetching && this.renderFetching()}
                {!isFetching && <ModelItem
                  items={item}
                  cardsAsList={this.state.cardsAsList}
                  loadItem={loadItem}
                  typesAsPictures={this.state.typesAsPictures}
                  isAuthenticated={isAuthenticated}
                  isAdmin={this.isAdmin()}
                  />}
              </div>
            </div>
          </div>

          {(snackMessage) && <div>
            <Snackbar
              theme={classes}
              active={this.state.loggedout}
              action='X'
              icon='done'
              type='warning'
              timeout={3000}
              label={snackMessage}
              onClick={(event, instance) => {
                dispatch(clearMessage())
                this.updateShowLogout()
              }}
              onTimeout={(event) => {
                dispatch(clearMessage())
                this.updateShowLogout()
              }} />
          </div>
}

        </Panel >
          <footer id='pageFooter' className={classes.foot}>
            <div
              className={classes.flexRowNoWrap}>
              <small>Navigation Software Copyright© 2016
                <a href='http://www.synchu.com' target='_blank'> synchu.com.</a>
                <div>
                  <span>Read </span>
                  <a href='privacypolicy.html' target='_blank'> our privacy policy</a>
                  <span> and </span>
                  <a href='termsofuse.html' target='_blank'> terms of use </a>
                </div>
                <div>
                  <span>Reach us at 
                    <a href='http://diyguitaramps.prophpbb.com/' target='_blank'> diyGuitarAmps.com</a>
                  </span>
                </div>
              </small>
              <SocialShare />
            </div>
          </footer>
      </Layout >
    )
  }
}

export default HomeView

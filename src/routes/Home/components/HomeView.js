import React, { Component, PropTypes } from 'react'
import classes from './HomeView.scss'
import Header from '../../../components/Header'
import ModelItem from '../../../components/ModelItem'
import SocialShare from '../../../components/SocialShare'
import {
  Snackbar, Switch,
  List, Panel, NavDrawer,
  Layout, ListItem, Tooltip,
  IconButton, Chip, FontIcon
} from 'react-toolbox'
import { Input } from 'react-toolbox/lib/input'
import { clearMessage } from '../../Login/modules/loginUser'
import MediaQuery from 'react-responsive'
import WelcomeDialog from './WelcomeDialog'
import classnames from 'classnames'

export const renderStatItem = (brandItem, index, tooltip, icon) => {
  const TTStats = Tooltip(IconButton)
  return (
    <span>
      <MediaQuery minDeviceWidth={767} >
        <TTStats primary icon={icon} tooltip={tooltip} theme={classes} className={classes.statsFontScale}>
          {<span>{brandItem[index]}</span>}
        </TTStats>
      </MediaQuery>
      <MediaQuery maxDeviceWidth={766} />
    </span>
  )
}

export class HomeView extends Component {
  state = {
    loggedout: false,
    invisibleChip: false, modelsAsList: false,
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
    isFetchingModels: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.renderFetching = this.renderFetching.bind(this)

    this.state.cardsAsList = JSON.parse(localStorage.getItem('cards_as_list')) || false
    this.state.modelsAsList = JSON.parse(localStorage.getItem('models_as_list')) || false
    this.state.showStats = JSON.parse(localStorage.getItem('show_stats')) === null
      ? true
      : JSON.parse(localStorage.getItem('show_stats'))
    this.state.welcomeActive = JSON.parse(localStorage.getItem('welcome_active')) === null
      ? true
      : JSON.parse(localStorage.getItem('welcome_active'))
  }

  updateShowLogout = () => {
    this.setState({ ...this.state, loggedout: !this.state.loggedout })
}

handleChange = (value, item) => {
  const {filterBrand, filterModels} = this.props
  if (item.target.name === 'filterBrand') {
    filterBrand(value)
  } else {
    filterModels(value)
  }
}

handleModelClicked = (item, e) => {
  const { loadItem, selectModel } = this.props
  localStorage.setItem('selected_model', item['1'])
  selectModel(item['1'])
  loadItem()
}

handleBrandClicked = (item, e) => {
  const { loadModels, selectBrand, selectModel, loadItem, selectedBrand } = this.props

  if (selectedBrand && selectedBrand === item['0']) { return }

  localStorage.setItem('selected_brand', item['0'])
  selectBrand(item['0'])
  loadModels()
  // clear model and items selection
  selectModel('')
  loadItem()
}

handleAddModelsArrow = (refString, isVisible) => {
  this.setState({...this.state, invisibleChip: !isVisible})
  }

renderModels = (model) => {
  const { selectedModel } = this.props
  let mc = this.handleModelClicked.bind(this, model)
  let hac = this.handleAddModelsArrow.bind(this, 'chip' + model.key)
  return (
    <span key={model.key}>
      {!this.state.modelsAsList &&
        <Chip key={model.key} onClick={mc} className={classes.modelChips} >
          {(selectedModel === model[1]) &&
            <FontIcon style={{ color: 'green', marginBottom: 'auto', fontSize: '1.6rem' }}
              value='check' />}
          <span title='Click to view items'><strong>{model[1]}</strong></span>
          {false &&
            <span className={classes.modelstats}>
              {renderStatItem(model, 2, 'No. of schematics', 'developer_board')}
              {renderStatItem(model, 4, 'No. of layouts', 'collections')}
              {renderStatItem(model, 3, 'No. of photos', 'photo')}
              {renderStatItem(model, 5, 'No. of other docs', 'attachment')}
            </span>}
        </Chip>
      }
      {this.state.modelsAsList &&
        <ListItem key={model.key} caption={model[1]} className={classes.modelListItem}
          leftIcon={selectedModel === model[1] ? 'check' : ''}
          onClick={mc} />
      }
    </span>
  )

}

renderBrands = (b) => {
  const { selectedBrand, models, filteredModels, isFetchingModels } = this.props
  const { modelsAsList, showStats } = this.state

  let bc = this.handleBrandClicked.bind(this, b)

  return (
    <span key={b.key}>
      <MediaQuery minDeviceWidth={768}>
        <ListItem key={b.key} caption={b[0]} className={classes.brandItem}
          leftIcon={selectedBrand === b[0] ? 'star' : 'subject'}
          rightIcon={showStats
            ? <span className={classes.brandstats}>
              {renderStatItem(b, 1, 'No. of schematics', 'developer_board')}
              {renderStatItem(b, 3, 'No. of layouts', 'collections')}
              {renderStatItem(b, 2, 'No. of photos', 'photo')}
              {renderStatItem(b, 4, 'No. of other docs', 'attachment')}
            </span>
            : <span></span>
          }
          onClick={bc} />
        {
          (b[0] === selectedBrand) &&
          <div style={{ display: 'flex', flexFlow: 'row wrap', marginLeft: '1rem' }}>
            {
              modelsAsList && !isFetchingModels &&
              <List>
                {(models) && models.filter((i) => i[1].toLowerCase()
                  .indexOf(filteredModels.toLowerCase()) !== -1)
                  .map(this.renderModels)}
              </List>
            }
            {
              !modelsAsList && !isFetchingModels &&
              (models) && models.filter((i) => i[1].toLowerCase()
                .indexOf(filteredModels.toLowerCase()) !== -1)
                .map(this.renderModels)
            }
            {isFetchingModels && <FontIcon style={{ margin: 'auto' }} key={b.key} value='hourglass_empty' />}
          </div>
        }
      </MediaQuery>
      <MediaQuery maxDeviceWidth={767}>
        <ListItem key={b.key} caption={(selectedBrand === b[0] ? String.fromCharCode(10003) + ' ' + b[0] : b[0])} className={classes.brandItem}
          onClick={bc} />
        {(b[0] === selectedBrand) &&
          <div style={{ display: 'flex', flexFlow: 'row wrap', marginLeft: '1rem' }}>
            {modelsAsList && !isFetchingModels &&
              <List>
                {(models) && models.filter((i) => i[1].toLowerCase().indexOf(filteredModels.toLowerCase()) !== -1).map(this.renderModels)}
              </List>}
            {!modelsAsList && !isFetchingModels &&
              (models) && models.filter((i) => i[1].toLowerCase().indexOf(filteredModels.toLowerCase()) !== -1).map(this.renderModels)
            }
            {isFetchingModels && <FontIcon style={{ margin: 'auto' }} key={b.key} value='hourglass_empty' />}
          </div>}
      </MediaQuery>

    </span>
  )
}

renderFetching() {
  const hide = () => this.refs.loadingSnack.hide()
  return (
    <Snackbar
      theme={classes}
      active={this.state.loggedout}
      action='X'
      icon='done'
      type='warning'
      timeout={1000}
      label='Loading...'
      ref='loadingSnack'
      onClick={hide}
      />
  )
}

componentDidMount() {
  const { loadBrands, loadModels, selectBrand, setNavbarActive, setNavbarPinned } = this.props
  loadBrands()
  const selectedBrand = localStorage.getItem('selected_brand')
  if (selectedBrand) {
    selectBrand(selectedBrand)
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

localSetNavbarActive = () => {
  const {navbarActive, setNavbarActive} = this.props
  setNavbarActive(!navbarActive)
}

handleTabListSwitch = (e, which) => {
  switch (which) {
    case 'models':
      localStorage.setItem('models_as_list', JSON.stringify(e))
      this.setState({...this.state, modelsAsList: e})
  break
    case 'cards':
  localStorage.setItem('cards_as_list', JSON.stringify(e))
  this.setState({...this.state, cardsAsList: e})
break
    case 'stats':
localStorage.setItem('show_stats', JSON.stringify(e))
this.setState({...this.state, showStats: e})
break
    default:
break
  }
  }

render() {
  const { snackMessage, dispatch, brands, filterBrand, filterModels, models, item } = this.props
  const { navbarPinned, navbarActive, isFetching, isAuthenticated } = this.props
  let { filteredBrand, filteredModels } = this.props

  return (
    <Layout className={classes.mainContainer}>
      <NavDrawer pinned={navbarPinned} active={navbarActive}
        scrollY width='normal' ref='navdrawer'>
        <div className={classnames(classes.navigation)} >
          <Panel className={classes.navtitle}>
            <div style={{ flexFlow: 'row wrap', display: 'flex' }}>
              <Input type='text' hint='Type to filter brands' label='Filter' icon='filter_list'
                className={classes.filterInputs}
                name='filterBrand'
                value={filteredBrand}
                onChange={this.handleChange} />
              {filteredBrand && <IconButton icon='close' onClick={() => filterBrand('')}
                style={{ position: 'absolute', right: '0.5rem', marginTop: '2rem', opacity: 0.5, padding: '0', width: '15%' }} />}
            </div>
          </Panel>
          <Panel className={classes.brands}>
            <List selectable>
              {(brands) && brands.filter((i) => i[0].toLowerCase().indexOf(filteredBrand.toLowerCase()) !== -1).map(this.renderBrands)}
            </List>
          </Panel>
        </div>

        <footer>
          <span style={{ display: 'flex', flexFlow: 'row wrap' }}>
            <Switch theme={classes} checked={this.state.modelsAsList}
              label='Models as list'
              onChange={(e) => this.handleTabListSwitch(e, 'models')} />
            <Switch theme={classes} checked={this.state.cardsAsList}
              label='Cards as list'
              onChange={(e) => this.handleTabListSwitch(e, 'cards')} />
            <Switch theme={classes} checked={this.state.showStats}
              label='Show stats'
              onChange={(e) => this.handleTabListSwitch(e, 'stats')} />
          </span>
        </footer>
      </NavDrawer>

      <Panel>
        {<WelcomeDialog welcomeActive={this.state.welcomeActive ? this.state.welcomeActive : false}
          handleWelcome={(e, type) => {
            if (type === 'from_switch') {
              localStorage.setItem('welcome_active', JSON.stringify(e))
            }
            this.setState({ ...this.state, welcomeActive: e })
          }
      } />}
        <Header isAuthenticated={isAuthenticated} dispatch={dispatch} className={classes.heading}
          drawer={this.refs.navdrawer} {...this.props} />
        <Panel className={classes.content}>
          <Panel style={{ overflowY: 'auto', flexDirection: 'row' }} scrollY className={classes.Panes}>
            <div style={{ color: 'blue' }}>
              THIS IS STILL A TEST!A lot of features may not yet work or may not work as expected, including the file links.
            </div>
            <Panel scrollY style={{ flexFlow: 'row wrap' }}>
              {isFetching && this.renderFetching()}
              {!isFetching && <ModelItem items={item} cardsAsList={this.state.cardsAsList} />}
            </Panel>
          </Panel>
        </Panel>

        {(snackMessage) &&
          <div>
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
              } }
              onTimeout={(event) => {
                dispatch(clearMessage())
                this.updateShowLogout()
              } }
              />
          </div>
        }
        <footer id='pageFooter'>
          <div style={{ display: 'flex', flexFlow: 'row nowrap' }}>
            <small>Navigation Software Copyright© 2016 <a href='http://www.synchu.com' target='_blank'>synchu.com.</a>
              <div>
                <span>Read</span> <a href='http://www.synchu.com' target='_blank' >our privacy policy</a> <span>and</span> <a href='http://www.synchu.com' target='_blank'>terms of use</a>
              </div>
              <div>
                <span>Reach us at <a href='http://diyguitaramps.prophpbb.com/' target='_blank'>diyGuitarAmps.com</a></span>
              </div>
            </small>
            <SocialShare />
          </div>
        </footer>
      </Panel >

    </Layout >
  )
}
        }

export default HomeView

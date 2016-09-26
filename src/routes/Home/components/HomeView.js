import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classes from './HomeView.scss'
import Header from '../../../components/Header'
import ModelItem from '../../../components/ModelItem'
import { Snackbar, List, Panel, NavDrawer, Layout, ListItem, Tooltip, IconButton, Chip, FontIcon } from 'react-toolbox'
import { Input } from 'react-toolbox/lib/input'
import { clearMessage } from '../../Login/modules/loginUser'
import SplitPane from 'react-split-pane'
import MediaQuery from 'react-responsive'
import VisibilitySensor from 'react-visibility-sensor'
import classnames from 'classnames'


export const renderStatItem = (brandItem, index, tooltip, icon) => {
  const TTStats = Tooltip(IconButton)
  return (
    <span>
      <MediaQuery minDeviceWidth={767}>
        <TTStats primary icon={icon} theme={classes} tooltip={tooltip}>
          {<span>{brandItem[index]}</span>}
        </TTStats>
      </MediaQuery>
      <MediaQuery maxDeviceWidth={766} />
    </span>
  )
}

export class HomeView extends Component {
  state = { loggedout: false, modelsPanel: {}, invisibleChip: false }

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
    selectedModel: PropTypes.string
  }

  constructor(props) {
    super(props)
    this.updateShowLogout = this.updateShowLogout.bind(this)
    this.handleBrandClicked = this.handleBrandClicked.bind(this)
    this.renderBrands = this.renderBrands.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.renderModels = this.renderModels.bind(this)
    this.renderFetching = this.renderFetching.bind(this)
  }

  updateShowLogout() {
    this.setState({ ...this.state, loggedout: !this.state.loggedout })
}

handleChange(value, item) {
  const {filterBrand, filterModels} = this.props
  if (item.target.name === 'filterBrand') {
    filterBrand(value)
  } else {
    filterModels(value)
  }
}

handleModelClicked(item, e) {
  const { loadItem, selectModel } = this.props
  localStorage.setItem('selected_model', item['1'])
  selectModel(item['1'])
  loadItem()
}

handleBrandClicked(item, e) {
  const { loadModels, selectBrand, selectModel, loadItem } = this.props
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

renderModels(model) {
  const { selectedModel } = this.props
  let mc = this.handleModelClicked.bind(this, model)
  let hac = this.handleAddModelsArrow.bind(this, 'chip' + model.key)
  return (
    /* VisibilitySensor key={model.key} containment={this.state.modelsPanel || (<span></span>)}
      minTopValue={100} delay={2500} onChange={hac}
      ref={'chip' + model.key} */
    <Chip key={model.key} onClick={mc} className={classes.modelChips} >
      {(selectedModel === model[1]) && <FontIcon style={{ color: 'green', marginBottom: 'auto', fontSize: '1.6rem' }} value='check' />}
      <span title='Click to view items'><strong>{model[1]}</strong></span>
      <span className={classes.modelstats}>
        {renderStatItem(model, 2, 'No. of schematics', 'developer_board') }
        {renderStatItem(model, 4, 'No. of layouts', 'collections') }
        {renderStatItem(model, 3, 'No. of photos', 'photo') }
        {renderStatItem(model, 5, 'No. of other docs', 'attachment') }
      </span>
    </Chip>
    /* VisibilitySensor*/
  )
}

renderBrands(b) {
  const { selectedBrand } = this.props

  let bc = this.handleBrandClicked.bind(this, b)

  return (
    <span key={b.key}>
      <MediaQuery minDeviceWidth={768}>
        <ListItem key={b.key} caption={b[0]} className={classes.brandItem} leftIcon={selectedBrand === b[0] ? 'star' : 'subject'}
          rightIcon={
            <span className={classes.brandstats}>
              {renderStatItem(b, 1, 'No. of schematics', 'developer_board') }
              {renderStatItem(b, 3, 'No. of layouts', 'collections') }
              {renderStatItem(b, 2, 'No. of photos', 'photo') }
              {renderStatItem(b, 4, 'No. of other docs', 'attachment') }
            </span>
          }
          onClick={bc} />
      </MediaQuery>
      <MediaQuery maxDeviceWidth={767}>
        <ListItem key={b.key} caption={(selectedBrand === b[0] ? String.fromCharCode(10003) + ' ' + b[0] : b[0]) } className={classes.brandItem}
          onClick={bc} />
      </MediaQuery>
    </span>
  )
}

renderFetching() {
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
      onClick={() => this.refs.loadingSnack.hide() }
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

  this.setState({...this.state, modelsPanel: ReactDOM.findDOMNode(this.refs.modelsPanel)})
}

localSetNavbarActive = () => {
  const {navbarActive, setNavbarActive} = this.props
  setNavbarActive(!navbarActive)
}

scrollDown = (e) => {
  ReactDOM.findDOMNode(this.refs.subModelsPanel).scrollTop += 50
}

render() {
  const { snackMessage, dispatch, brands, filterBrand, filterModels, models, item } = this.props
  const { navbarPinned, navbarActive, isFetching, isAuthenticated } = this.props
  let { filteredBrand, filteredModels } = this.props
  return (
    <Layout classes={classes.mainContainer}>
      <NavDrawer pinned={navbarPinned} active={navbarActive}
        scrollY width='normal' ref='navdrawer'>
        <div className={classnames(classes.navigation) } >
          <Panel className={classes.navtitle}>
            <div style={{ flexDirection: 'row', display: 'flex' }}>
              <Input type='text' hint='Type to filter brands' label='Filter' icon='filter_list'
                className={classes.filterInputs}
                name='filterBrand'
                value={filteredBrand}
                onChange={this.handleChange} />
              {filteredBrand && <IconButton icon='close' onClick={() => filterBrand('') } style={{ marginTop: '2rem', opacity: 0.5 }} />}
            </div>
          </Panel>
          <Panel className={classes.brands}>
            <List selectable>
              {(brands) && brands.filter((i) => i[0].toLowerCase().indexOf(filteredBrand.toLowerCase()) !== -1).map(this.renderBrands) }
            </List>
          </Panel>
        </div>
      </NavDrawer>

      <Panel>
        <Header isAuthenticated={isAuthenticated} dispatch={dispatch} className={classes.heading} drawer={this.refs.navdrawer}
          {...this.props} />
        <Panel className={classes.content}>
          <MediaQuery minDeviceWidth={668} component={SplitPane} split='horizontal' minSize={200} defaultSize={'33%'}
            maxSize={400} resizerStyle={classes.Resizer}
            pane2Style={{ overflowY: 'auto', flexDirection: 'row' }}>
            <Panel scrollY className={classes.Panes} ref='modelsPanel'>
              <Panel scrollY style={{ flexDirection: 'row' }} ref='subModelsPanel'>
                <div style={{ marginBottom: 'auto', marginRight: 'auto', marginTop: '6rem' }} ref>
                  <div style={{ color: 'blue' }}>
                    THIS IS STILL A TEST!A lot of features may not yet work or may not work as expected, including the file links.
                  </div>
                  {!this.props.selectedBrand && <h5>Select a model on the left</h5>}
                  <Input type='search' hint='Type to filter models' label='Filter' icon='filter_list'
                    name='filterModels'
                    value={filteredModels}
                    onChange={this.handleChange}
                    className={classes.filterInputs}
                    style={{ width: '30%' }} />
                  {filteredModels &&
                    <IconButton icon='close' onClick={() => filterModels('') } style={{ marginTop: '2rem', opacity: 0.5 }} />
                  }
                  <span style={{ flexWrap: 'wrap' }}>
                    {(models) && models.filter((i) => i[1].toLowerCase().indexOf(filteredModels.toLowerCase()) !== -1).map(this.renderModels) }
                  </span>
                </div>
                <div style={{ bottom: '10px', right: '10px', position: 'absolute' }}>
                  {this.state.invisibleChip && <IconButton icon='arrow_downward' primary onClick={this.scrollDown} />}
                </div>
              </Panel>
            </Panel>
            <Panel scrollY className={classes.Panes}>
              <Panel scrollY style={{ flexFlow: 'row wrap' }}>
                {isFetching && this.renderFetching() }
                {!isFetching && <ModelItem items={item} />}
              </Panel>
            </Panel>
          </MediaQuery>
          <MediaQuery maxDeviceWidth={667} component={SplitPane} split='horizontal' minSize={200} defaultSize={'40%'}
            maxSize={400} resizerStyle={classes.Resizer}
            pane2Style={{ overflowY: 'auto', flexDirection: 'row' }}>
            <Panel scrollY className={classes.Panes}>
              <Panel scrollY style={{ flexDirection: 'row' }}>
                <div style={{ marginBottom: 'auto', marginRight: 'auto', marginTop: '6rem' }}>
                  <div style={{ color: 'blue' }}>
                    THIS IS STILL A TEST!A lot of features may not yet work or may not work as expected, including the file links.
                  </div>
                  {!this.props.selectedBrand && <h5>Select a model on the left</h5>}
                  {filteredModels &&
                    <IconButton icon='close' onClick={() => filterModels('') } style={{ marginTop: '2rem', opacity: 0.5 }} />
                  }
                  <span style={{ flexWrap: 'wrap' }}>
                    {(models) && models.filter((i) => i[1].toLowerCase().indexOf(filteredModels.toLowerCase()) !== -1).map(this.renderModels) }
                  </span>
                </div>
              </Panel>
            </Panel>
            <Panel scrollY className={classes.Panes}>
              <Panel scrollY style={{ flexFlow: 'row wrap' }}>
                {isFetching && this.renderFetching() }
                {!isFetching && <ModelItem items={item} />}
              </Panel>
            </Panel>
          </MediaQuery>
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
        <footer>
          <div>
            <small>Navigation Software Copyright© 2016 <a href='http://www.synchu.com' target='_blank'>synchu.com.</a> <div> <span>Read</span> <a href='http://www.synchu.com' target='_blank' >our privacy policy</a> <span>and</span> <a href='http://www.synchu.com' target='_blank'>terms of use</a> </div></small>
          </div>
        </footer>
      </Panel >

    </Layout >
  )
}
      }

export default HomeView

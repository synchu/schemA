import React, {Component, PropTypes} from 'react'
import {
  Tab,
  Switch,
  Tabs,
  FontIcon,
  Card,
  CardMedia,
  CardTitle,
  CardText,
  CardActions,
  IconButton,
  Input
} from 'react-toolbox'
import {Link} from 'react-router'
import classes from './ModelItem.scss'
import MediaQuery from 'react-responsive'
import TableView from './TableView'
import {DESCRIPTION} from 'utils/constants'
import {transformData} from './TransformData'
import {updateField, getDBFieldName} from '../../utils/updateDb'

const makeField = (itemDataVersion, fieldName) => (itemDataVersion + '_' + fieldName)
const mc = (itemDataVersion) => (itemDataVersion + '_changed')

const isImageByExt = (media) => (media.toLowerCase().match(/jpg|png|jpeg|bmp|gif/))

const makeDownloadLink = (linkData) => {
  const {
    href,
    icon,
    text,
    activeLinkClass,
    ...other
  } = linkData
  return (
    <Link to={href} activeClassName={activeLinkClass} target='_blank' {...other}>
      <span><FontIcon className={classes.actionIcons} value={icon} /> {text}</span>
    </Link>
  )
}

export const getTabIcon = (iconName, typesAsPictures) => {
  let tabIcon =
      typesAsPictures
      ? iconName
      : (() => {
        switch (iconName) {
          case 'developer_board': return 'SCH'
          case 'collections': return 'LO'
          case 'photo': return 'PH'
          case 'attachment': return 'OTH'
          default:
            return
        }
      })(iconName)
  return tabIcon
}

export class ModelItem extends Component {
  state = {}
  static propTypes = {
    items: PropTypes.array,
    cardsAsList: PropTypes.bool,
    loadItem: PropTypes.func,
    isAuthenticated: PropTypes.bool,
    typesAsPictures: PropTypes.bool,
    isAdmin: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.handleClick = this
      .handleClick
      .bind(this)
  }

  handleClick = (e) => {
    // console.log(e.target.id)
  }

  handleFixedTabChange = (index, version) => {
    this.setState({
      ...this.state,
      [version]: index
    })
  }

  handleTabListSwitch = (value, version) => {
    this.setState({
      ...this.state,
      ['switch' + version]: value
    })
  }

  getMedia = (itemData) => {
    let media = ''
    if (itemData) {
      media = itemData.photos.length > 0
        ? itemData.photos[0].photo
        : itemData.layouts.length > 0
          ? itemData.layouts[0].layout
          : itemData.others.length > 0
            ? itemData.others[0].other
            : ''
    }
    if (isImageByExt(media)) {
      return (<img
        src={media}
        title={itemData.photos[0]
        ? itemData.photos[0].photoName
        : itemData.version}
        alt={itemData.photos[0]
        ? itemData.photos[0].photoName
        : itemData.version} />)
    } else if (media !== '') {
      return (makeDownloadLink({href: media, text: media, icon: 'file_download', activeLinkClass: classes.activeRoute}))
    } else {
      return (
        <h5
          style={{
            padding: '1rem',
            marginBottom: 'auto'
          }}>
          <strong>No photos or layouts to display yet. Please, contact us, if you would
            like to contribute.
          </strong>
        </h5>
      )
    }
  }

  renderPhotos = (photo) => {
    return (makeDownloadLink({
      key: photo.id,
      href: photo.photo,
      icon: (<img src={photo.photo} alt={photo.photoName} height='48' width='48' />),
      text: photo.photoName + ' by ' + photo.photoContributor,
      activeLinkClass: classes.activeRoute,
      style: {
        marginRight: 'auto',
        padding: '3px'
      }
    }))
  }

  renderLayouts = (layout) => {
    return (makeDownloadLink({
      key: layout.id,
      href: layout.layout,
      icon: 'file_download',
      text: layout.layoutName + ' by ' + layout.layoutContributor,
      activeLinkClass: classes.activeRoute
    }))
  }

  renderSchematics = (schematic) => {
    return (makeDownloadLink({
      key: schematic.id,
      href: schematic.schematic,
      icon: 'file_download',
      text: schematic.schematicName + ' by ' + schematic.schematicContributor,
      activeLinkClass: classes.activeRoute
    }))
  }

  renderOthers = (other) => {
    return (makeDownloadLink({
      key: other.id,
      href: other.other,
      icon: 'file_download',
      text: other.otherName + ' by ' + other.otherContributor,
      activeLinkClass: classes.activeRoute
    }))
  }

  openPhotoLibrary = (itemData) => {}

  /**
 * makeTabLabel - generates labels for the card tabs, <br /> used to force IE render
 * tab label on a new line on larger screen devices
 * @memberOf ModelItem
 */
  makeTabLabel = (text, stats, icon) => {
    return (
      <span>
        <MediaQuery minDeviceWidth={769}>
          <span className={classes.tab} title={text}><FontIcon value={icon} /><br />{text}
            <i>({stats})
            </i>
          </span>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={768}>
          <span className={classes.tab} title={text}><FontIcon value={icon} /><br />
            <i>({stats})
            </i>
          </span>
        </MediaQuery>
      </span>
    )
  }

  renderTabbedView = (itemData) => {
    const {typesAsPictures} = this.props
    return (
      <Tabs
        index={this.state[itemData.version]}
        fixed
        onChange={(e) => this.handleFixedTabChange(e, itemData.version)}
        className={classes.tabs}>
        <Tab
          label={this.makeTabLabel('Schematics', itemData.schematics.length, getTabIcon('developer_board', typesAsPictures))}>
          <div className={classes.actionItems}>
            {itemData
              .schematics
              .map((s) => this.renderSchematics(s))}
          </div>
        </Tab>
        <Tab
          label={this.makeTabLabel('Layouts', itemData.layouts.length, getTabIcon('collections', typesAsPictures))}>
          <div className={classes.actionItems}>
            {itemData
              .layouts
              .map((l) => this.renderLayouts(l))}
          </div>
        </Tab>
        <Tab label={this.makeTabLabel('Photos', itemData.photos.length, getTabIcon('photo', typesAsPictures))}>
          <div className={classes.actionItems}>
            {itemData
              .photos
              .map((p) => this.renderPhotos(p))}
          </div>
        </Tab>
        <Tab label={this.makeTabLabel('Other', itemData.others.length, getTabIcon('attachment', typesAsPictures))}>
          <div className={classes.actionItems}>
            {itemData
              .others
              .map((o) => this.renderOthers(o))}
          </div>
        </Tab>
      </Tabs>
    )
  }

  handleEditChange = (field) => (value) => {
    this.setState({
      ...this.state,
      [field]: value.length > 1 ? value : ' ',
      [mc(field.split('_')[0])]: value.length > 0
    })
  }

  handleErrors = (response) => {
    if (!response.ok) {
      throw Error(response.statusText)
    }
    return response
  }

  saveChanges = (field, itemData) => {
    if (!(this.state[mc(itemData.version)]) || (this.state[field].length === 0)) {
      // nothing happened - exit
      return
    }
    if (updateField(field, this.state[field], itemData)) {
     // console.log(field)
     // console.log(itemData)
      if (this.state[field]) {
        this.setState({
          ...this.state,
          saving: false,
          [field]: undefined,
          [mc(itemData.version)]: false
        })
      }
      console.log('will call loadItem now!')
      this.props.loadItem(true)
    } else {
      this.setState({
        ...this.state,
        saving: false,
        error: true
      })
    }
  }

  handleEditBlur = (field, itemData) => {
    if (!(this.state[mc(itemData.version)]) || (this.state[field].length === 0)) {
      // nothing happened - exit
      return
    }

    this.setState({
      ...this.state,
      saving: true,
      error: false
    })
    if (updateField(field, this.state[field], itemData)) {
     // console.log(field)
     // console.log(itemData)
      if (this.state[field]) {
        this.setState({
          ...this.state,
          saving: false,
          [field]: undefined,
          [mc(itemData.version)]: false
        })
      }
      this.props.loadItem(true)
    } else {
      this.setState({
        ...this.state,
        saving: false,
        error: true
      })
    }
  }

  renderEditComponent = (itemData, field) => {
    let fieldLocal = makeField(itemData.version, field)
    let content = itemData.description

    return (
      <span
        style={{
          display: 'inline-block',
          width: '100%',
          minWidth: '200px'
        }}>
        <Input
          label=''
          multiline
          value={this.state[fieldLocal]}
          onChange={this.handleEditChange(fieldLocal)}
          // onBlur={() => this.handleEditBlur(fieldLocal, itemData)}
          hint={content}
          style={{
            fontSize: '1.5rem'
          }} />
      </span>
    )
  }

  handleEditClick = (value, content) => (e) => {
    const {isAuthenticated, isAdmin} = this.props
    if (!isAuthenticated || !isAdmin) {
      console.warn('card edit not authotized')
      return
    }
    this.setState({
      ...this.state,
      [value]: content === ''
        ? ' '
        : content
    })
  }

  renderEditButton = (field, content) => {
    const {isAuthenticated, isAdmin} = this.props
    if (!isAuthenticated || !isAdmin) {
      return
    }

    return (<IconButton
      icon='mode_edit'
      title='Edit'
      className={classes.actionButtons}
      onClick={this.handleEditClick(field, content)} />)
  }

  handleCancelClick = (value) => (e) => {
    console.log('handle cancel click')
    this.setState({
      ...this.state,
      [value]: undefined,
      [mc(value.split('_')[0])]: false
    })
  }
  renderCancelButton = (field) => {
    return (<IconButton
      icon='cancel'
      title='Cancel edit'
      className={classes.actionButtons}
      onClick={this.handleCancelClick(field)} />)
  }

  handleSaveClick = (field, itemData) => (e) => {
    this.saveChanges(field, itemData)
  }

  renderSaveButton = (field, itemData) => {
    return (<IconButton
      icon='save'
      title='Save'
      className={classes.actionButtons}
      onClick={this.handleSaveClick(field, itemData)} />)
  }

  renderTitleField = (itemData, field) => {
    return (
      <span
        className={classes.flexDisplay}
        style={{
          paddingRight: '5px'
        }}>
        {!this.state[makeField(itemData.version, field)] && itemData[field]}
        {!this.state[makeField(itemData.version, field)] && this.renderEditButton(makeField(itemData.version, field), itemData[field])}
        {this.state[makeField(itemData.version, field)] && this.renderEditComponent(itemData, field)}
        {this.state[mc(itemData.version)] && this.renderSaveButton(makeField(itemData.version, field), itemData)}
        {this.state[makeField(itemData.version, field)] && this.renderCancelButton(makeField(itemData.version, field))}
      </span>
    )
  }

  renderModelsCard = (itemData) => {
    let arr = [itemData]
    return (
      <Card
        key={itemData.version}
        raised
        className={classes.itemCard}
        id={itemData.version}
        style={!this.state[mc(itemData.version)]
        ? {}
        : {
          backgroundColor: 'lavender'
        }}>
        <CardTitle
          title={this.renderTitleField(itemData, 'version')}
          subtitle={this.renderTitleField(itemData, 'model')} />
        <MediaQuery minDeviceWidth={768}>
          <CardMedia aspectRatio='wide'>
            {this.getMedia(itemData)}
          </CardMedia>
        </MediaQuery>
        <CardText>
          <div className={classes.flexDisplay}>
            {this.state[makeField(itemData.version, 'description')] && this.renderEditComponent(itemData, 'description')}
            {this.state[mc(itemData.version)] && this.renderSaveButton(makeField(itemData.version, 'description'), itemData)}
            {this.state[makeField(itemData.version, 'description')] && this.renderCancelButton(makeField(itemData.version, 'description'))}
            {!this.state[makeField(itemData.version, 'description')] && <span>{itemData.description && itemData.description.length > 1
                ? itemData.description
                : 'No description yet'} {this.renderEditButton(makeField(itemData.version, 'description'), itemData.description)}
            </span>
}
          </div>
        </CardText>
        <CardActions className={classes.itemCardActions}>
          <Switch
            theme={classes}
            checked={this.state['switch' + itemData.version]}
            label='Tab/list view'
            onChange={(e) => this.handleTabListSwitch(e, itemData.version)} /> {this.state['switch' + itemData.version]
            ? <TableView itemData={arr} tabIcon={getTabIcon} {...this.props} />
            : this.renderTabbedView(itemData)}
        </CardActions>
      </Card>

    )
  }

  extractDescriptions = (item) => {
    if (item.length <= 0) {
      return
    }
    let descriptions = []
    item.filter((i) => i.type === DESCRIPTION).map((j) => descriptions.push(j))
    return descriptions
  }

  componentWillMount = (prevProps) => {
    this.setState({
      itemObjects: transformData(this.props.items)
    })
  }

  render () {
    const {cardsAsList} = this.props
    const {itemObjects} = this.state

    return (
      <div>
        {!cardsAsList && itemObjects.map(this.renderModelsCard)}
        {cardsAsList && <TableView itemData={itemObjects} tabIcon={getTabIcon} {...this.props} />
}
      </div>
    )
  }
}

export default ModelItem

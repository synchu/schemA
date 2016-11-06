import React, { Component, PropTypes } from 'react'
import {
  Tab, Switch, Tabs,
  FontIcon, Card, CardMedia,
  CardTitle, CardText, CardActions,
  IconButton
} from 'react-toolbox'
import { Link } from 'react-router'
import classes from './ModelItem.scss'
import MediaQuery from 'react-responsive'
import TableView from './TableView'
import { DESCRIPTION, SCHEMATIC, LAYOUT, OTHER, PHOTO } from 'utils/constants'


const transformData = (item) => {
  let itemObjects = []

  let j = 0


  item.map((i) => {
    let bFound = false
    let itemObject = {
      model: '', version: '', description: '', contributor: '', descriptionDate: new Date(),
      layouts: [], schematics: [], photos: [], others: []
    }

    for (j = 0; j < itemObjects.length; j++) {
      if (itemObjects[j].version === i.version) {
        bFound = true
        break
      }
    }

    if (bFound) {
      itemObject = itemObjects[j]
    } else {
      itemObject.version = i.version
      itemObject.model = i.model
    }

    switch (i.type) {
      case DESCRIPTION:
        itemObject.description = i.data
        itemObject.contributor = i.contributor
        itemObject.descriptionDate = i.datestamp
        break
      case LAYOUT:
        itemObject.layouts.push({
          id: itemObject.layouts.length + 1,
          layout: i.data,
          layoutName: i.filename,
          layoutDate: i.datestamp,
          layoutContributor: i.contributor
        })
        break
      case SCHEMATIC:
        itemObject.schematics.push({
          id: itemObject.schematics.length + 1,
          schematic: i.data,
          schematicName: i.filename,
          schematicDate: i.datestamp,
          schematicContributor: i.contributor
        })
        break
      case PHOTO:
        itemObject.photos.push({
          id: itemObject.photos.length + 1,
          photo: i.data,
          photoName: i.filename,
          photoDate: i.datestamp,
          photoContributor: i.contributor
        })
        break
      case OTHER:
        itemObject.others.push({
          id: itemObject.others.length + 1,
          other: i.data,
          otherName: i.filename,
          otherDate: i.datestamp,
          otherContributor: i.contributor
        })
        break
      default:
        break
    }
    if (!bFound) { itemObjects.push(itemObject) }
  })

  return itemObjects
}

const isImageByExt = (media) => (media.toLowerCase().match(/jpg|png|jpeg|bmp|gif/))

const makeDownloadLink = (linkData) => {
  const {href, icon, text, activeLinkClass, ...other} = linkData
  return (
    <Link to={href} activeClassName={activeLinkClass} target='_blank' {...other}>
      <span><FontIcon className={classes.actionIcons} value={icon} /> {text}</span>
    </Link>
  )
}

export class ModelItem extends Component {
  state = {}
  static propTypes = {
    items: PropTypes.array,
    cardsAsList: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick = (e) => {
    // console.log(e.target.id)
  }

  handleEditClick = (value) => (e) => {
    console.log(e)
    console.log(value)
  }

  handleFixedTabChange = (index, version) => {
    this.setState({ ...this.state, [version]: index })
}

handleTabListSwitch = (value, version) => {
  this.setState({...this.state, ['switch' + version]: value})
  }

getMedia = (itemData) => {
  let media = ''
  if (itemData) {
    media = itemData.photos.length > 0 ? itemData.photos[0].photo : itemData.layouts.length > 0 ? itemData.layouts[0].layout : itemData.others.length > 0 ? itemData.others[0].other : ''
  }
  if (isImageByExt(media)) {
    return (
      <img src={media} title={itemData.photos[0] ? itemData.photos[0].photoName : itemData.version}
        alt={itemData.photos[0] ? itemData.photos[0].photoName : itemData.version} />
    )
  } else if (media !== '') {
    return (
      makeDownloadLink({ href: media, text: media, icon: 'file_download', activeLinkClass: classes.activeRoute })
    )
  } else {
    return (
      <h5 style={{ padding: '1rem', marginBottom: 'auto' }}>
        <strong>No photos or layouts to display yet.
          Please, contact us, if you would like to contribute.
        </strong>
      </h5>
    )
  }
}

renderPhotos = (photo) => {
  return (
    makeDownloadLink({
      key: photo.id, href: photo.photo,
      icon: (<img src={photo.photo} alt={photo.photoName} height='48' width='48' />),
      text: photo.photoName + ' by ' + photo.photoContributor,
      activeLinkClass: classes.activeRoute,
      style: { marginRight: 'auto', padding: '3px' }
    })
  )
}

renderLayouts = (layout) => {
  return (
    makeDownloadLink({
      key: layout.id, href: layout.layout, icon: 'file_download',
      text: layout.layoutName + ' by ' + layout.layoutContributor, activeLinkClass: classes.activeRoute
    })
  )
}

renderSchematics = (schematic) => {
  return (
    makeDownloadLink({
      key: schematic.id, href: schematic.schematic, icon: 'file_download',
      text: schematic.schematicName + ' by ' + schematic.schematicContributor, activeLinkClass: classes.activeRoute
    })
  )
}

renderOthers = (other) => {
  return (
    makeDownloadLink({
      key: other.id, href: other.other, icon: 'file_download',
      text: other.otherName + ' by ' + other.otherContributor, activeLinkClass: classes.activeRoute
    })
  )
}

openPhotoLibrary = (itemData) => {

}



/**
 * makeTabLabel - generates labels for the card tabs, <br /> used to force IE render
 * tab label on a new line on larger screen devices
 * @memberOf ModelItem
 */
makeTabLabel = (text, stats, icon) => {
  return (
    <span>
      <MediaQuery minDeviceWidth={769}>
        <span className={classes.tab} title={text}><FontIcon value={icon} /><br />{text}<i>({stats}) </i></span>
      </MediaQuery>
      <MediaQuery maxDeviceWidth={768}>
        <span className={classes.tab} title={text}><FontIcon value={icon} /><br /> <i>({stats}) </i></span>
      </MediaQuery>
    </span>
  )
}

renderTabbedView = (itemData) => {
  return (
    <Tabs index={this.state[itemData.version]} fixed onChange={(e) => this.handleFixedTabChange(e, itemData.version)}
      className={classes.tabs}>
      <Tab label={this.makeTabLabel('Schematics', itemData.schematics.length, 'developer_board')}>
        <div className={classes.actionItems}>
          {itemData.schematics.map((s) => this.renderSchematics(s))}
        </div>
      </Tab>
      <Tab label={this.makeTabLabel('Layouts', itemData.layouts.length, 'collections')}>
        <div className={classes.actionItems}>
          {itemData.layouts.map((l) => this.renderLayouts(l))}
        </div>
      </Tab>
      <Tab label={this.makeTabLabel('Photos', itemData.photos.length, 'photo')}>
        <div className={classes.actionItems}>
          {itemData.photos.map((p) => this.renderPhotos(p))}
        </div>
      </Tab>
      <Tab label={this.makeTabLabel('Other', itemData.others.length, 'attachment')}>
        <div className={classes.actionItems}>
          {itemData.others.map((o) => this.renderOthers(o))}
        </div>
      </Tab>
    </Tabs>
  )
}

renderEditButton = (field) => {
  return (
    <IconButton icon='mode_edit' className={classes.actionButtons}
      onClick={this.handleEditClick(field)} />
  )
}

renderTitleField = (field, itemData) => {
  return (
    <span className={classes.flexDisplay} style={{ paddingRight: '5px' }}>{itemData[field]}{this.renderEditButton(field)}</span>
  )
}

renderModelsCard = (itemData) => {
  let arr = [itemData]
  return (
    <Card key={itemData.version} raised className={classes.itemCard} >
      <CardTitle title={this.renderTitleField('version', itemData)} subtitle={this.renderTitleField('model', itemData)} />
      <MediaQuery minDeviceWidth={768}>
        <CardMedia aspectRatio='wide'>
          {this.getMedia(itemData)}
        </CardMedia>
      </MediaQuery>
      <CardText>
        <div className={classes.flexDisplay}>
          <span>{itemData.description}{this.renderEditButton('description')}</span>
        </div>
      </CardText>
      <CardActions className={classes.itemCardActions} >
        <Switch theme={classes} checked={this.state['switch' + itemData.version]}
          label='Tab/list view'
          onChange={(e) => this.handleTabListSwitch(e, itemData.version)} />
        {this.state['switch' + itemData.version] ? <TableView itemData={arr} {...this.props} /> : this.renderTabbedView(itemData)}
      </CardActions>
    </Card>

  )
}

extractDescriptions = (item) => {
  if (item.length <= 0) return
  let descriptions = []
  item.filter((i) => i.type === DESCRIPTION).map((j) => descriptions.push(j))
  return descriptions
}

render() {
  const { items, cardsAsList } = this.props
  let itemObjects = transformData(items)

  return (
    <div>
      {!cardsAsList && itemObjects.map(this.renderModelsCard)}
      {cardsAsList &&
        <TableView itemData={itemObjects} {...this.props} />
      }
    </div>
  )
}
}


export default ModelItem

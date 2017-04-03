import React, { Component, PropTypes } from 'react'
import { FontIcon, Tooltip } from 'react-toolbox'
import { Link } from 'react-router'
import DownloadLink from '../DownloadLink'
import {getFile} from '../../utils/utils'
import classes from './TableView.scss'
import classnames from 'classnames'

const DESCRIPTION = 'Description'
const LAYOUT = 'Layout'
const SCHEMATIC = 'Schematic'
const PHOTO = 'Photo'
const OTHER = 'Other'

const isImageByExt = (media) => (media.toLowerCase().match(/jpg|png|jpeg|bmp|gif/))

const makeDownloadLink = (linkData) => {
  const {
    href,
    icon,
    text,
//    activeLinkClass,
    uploadname/*,
    ...other*/
  } = linkData

  return (
    <DownloadLink key={href} icon={icon} text={text} existingFile={href} uploadname={uploadname} />
  )
   /* return (
      <Link to={getFile(href, uploadname, 'attachment')} activeClassName={activeLinkClass} target='_blank' {...other}>
        <span><FontIcon className={classes.actionIcons} value={icon} /> {text}</span>
      </Link>
    )*/
}

export class TableView extends Component {
  state = {}
  static propTypes = {
    itemData: PropTypes.array,
    cardsAsList: PropTypes.bool,
    tabIcon: PropTypes.func,
    typesAsPictures: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.makeTableSource = this.makeTableSource.bind(this)
    this.renderTabView = this.renderTabView.bind(this)
    this.sortTable = this.sortTable.bind(this)
    this.sortByField = this.sortByField.bind(this)
  }

  makeTableSource = () => {
    const {itemData, tabIcon, typesAsPictures} = this.props

    let tableSource = []
    let key = 0

    itemData.map((a) => {
      a.schematics.forEach((i) => {
        tableSource.push({
          key: key++,
          type: SCHEMATIC, icon: tabIcon('developer_board', typesAsPictures),
          text: i.schematicName, by: i.schematicContributor,
          uploadname: i.uploadname, updateId: i.updateId,
          href: i.schematic,
          version: a.version
        })
      })

      a.layouts.forEach((i) => {
        tableSource.push({
          key: key++,
          type: LAYOUT, icon: tabIcon('collections', typesAsPictures),
          text: i.layoutName, by: i.layoutContributor,
          uploadname: i.uploadname, updateId: i.updateId,
          href: i.layout,
          version: a.version
        })
      })

      a.others.forEach((i) => {
        tableSource.push({
          key: key++,
          type: OTHER, icon: tabIcon('attachment', typesAsPictures),
          text: i.otherName, by: i.otherContributor,
          uploadname: i.uploadname, updateId: i.updateId,
          href: i.other,
          version: a.version
        })
      })

      a.photos.forEach((i) => {
        tableSource.push({
          key: key++,
          type: PHOTO, icon: (<img src={i.photo} alt={i.photoName} height='36' width='36' />),
          text: i.photoName, by: i.photoContributor,
          uploadname: i.uploadname, updateId: i.updateId,
          href: i.photo,
          version: a.version
        })
      })
    })
    this.setState({ ...this.state, tableData: tableSource })
  }

  compareT = (a, b) => {
    const { sort } = this.state
    if (a[sort.by] < b[sort.by]) {
      return -1
    }
    if (a[sort.by] > b[sort.by]) {
      return 1
    }
    return 0
  }

  sortByField = (field, ascValue) => {
    const { tableData } = this.state
  // synchronous set state
    this.state = Object.assign({}, this.state, { sort: { by: field, asc: ascValue } })
    return (tableData.sort(this.compareT))
  }

  sortTable = (e) => {
    const {sort} = this.state

    let sortedData = []

    if ((sort) && (sort.by === e)) {
      if (sort.asc) {
        sortedData = this.sortByField(e, false).reverse()
      } else {
        sortedData = this.sortByField(e, true)
      }
    } else {
      sortedData = this.sortByField(e, true)
    }
    this.setState({ ...this.state, tableData: sortedData })
  }

  renderTabView = () => {
    const { cardsAsList } = this.props
    let scType = this.sortTable.bind(this, 'type')
    let scText = this.sortTable.bind(this, 'text')
    let scBy = this.sortTable.bind(this, 'by')
    let TTFontIcon = Tooltip(FontIcon)
    return (
      <table className={classnames('table', 'table-stripped', 'table-condensed')}>
        <thead className={classes.tableHeader}>
          <tr>
            {cardsAsList &&
              <th>
               Version
              </th>
            }
            <th title='Click or tap to sort' onClick={scType}>Type</th>
            <th title='Click or tap to sort' onClick={scText}>Item</th>
            <th title='Click or tap to sort' onClick={scBy}>Contributor</th>
          </tr>
        </thead>
        <tbody>
        {this.state.tableData.map((i) => {
          return (<tr key={i.key}>
            {cardsAsList &&
              <td>
                {i.version}
              </td>
            }
            <td>
              <TTFontIcon value={i.type === PHOTO
                ? <img src={this.state[i.updateId]} alt={i.photoName} height='36' width='36' />
                : i.icon}
                tooltip={i.type} title={i.type} className={classes.actionIcons} />
            </td>
            <td>
              {makeDownloadLink({ href: i.href, text: i.text, uploadname: i.uploadname, activeLinkClass: classes.activeRoute })}
            </td>
            <td>
              {i.by}
            </td>
          </tr>)
        })}
      </tbody>
    </table>
    )
  }

  customSetState = (value, stateObject) => {
    // console.log('customSetState:', stateObject, value.target.result)
    this.setState({...this.state, [stateObject]: value.target.result})
  }

  componentWillMount = () => {
    this.makeTableSource()
  }

  componentDidMount = () => {
    const {tableData} = this.state
    if (!tableData[0]) {
      return
    }
    tableData.filter(b => b.type === PHOTO).map(i => {
      getFile(i.href, i.uploadname, 'inline', this.customSetState, i.updateId)
    })
  }

  render () {
    const { itemData } = this.props
    return (
      <div key={itemData.version}>
        {(this.state.tableData) && this.renderTabView()}
      </div>
    )
  }
}

export default TableView

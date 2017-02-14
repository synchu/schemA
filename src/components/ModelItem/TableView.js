import React, { Component, PropTypes } from 'react'
import { FontIcon, Tooltip } from 'react-toolbox'
import { Link } from 'react-router'
import classes from './TableView.scss'
import classnames from 'classnames'

const DESCRIPTION = 'Description'
const LAYOUT = 'Layout'
const SCHEMATIC = 'Schematic'
const PHOTO = 'Photo'
const OTHER = 'Other'

const isImageByExt = (media) => (media.toLowerCase().match(/jpg|png|jpeg|bmp|gif/))

const makeDownloadLink = (linkData) => {
  const {href, text, activeLinkClass} = linkData
  return (
    <Link to={href} activeClassName={activeLinkClass} target='_blank'>
      {text}
    </Link>
  )
}

export class TableView extends Component {
  state = {}
  static propTypes = {
    itemData: PropTypes.array,
    cardsAsList: PropTypes.bool,
    tabIcon: PropTypes.func,
    typesAsPictures: PropTypes.bool
  }

  constructor(props) {
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
          href: i.schematic,
          version: a.version
        })
      })

      a.layouts.forEach((i) => {
        tableSource.push({
          key: key++,
          type: LAYOUT, icon: tabIcon('collections', typesAsPictures),
          text: i.layoutName, by: i.layoutContributor,
          href: i.layout,
          version: a.version
        })
      })

      a.others.forEach((i) => {
        tableSource.push({
          key: key++,
          type: OTHER, icon: tabIcon('attachment', typesAsPictures),
          text: i.otherName, by: i.otherContributor,
          href: i.other,
          version: a.version
        })
      })

      a.photos.forEach((i) => {
        tableSource.push({
          key: key++,
          type: PHOTO, icon: (<img src={i.photo} alt={i.photoName} height='36' width='36' />),
          text: i.photoName, by: i.photoContributor,
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
    }
    else {
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
              <TTFontIcon value={i.icon} tooltip={i.type} title={i.type} className={classes.actionIcons} />
            </td>
            <td>
              {makeDownloadLink({ href: i.href, text: i.text, activeLinkClass: classes.activeRoute })}
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


componentDidMount() {
  this.makeTableSource()
}

render() {
  const { itemData } = this.props
  return (
    <div key={itemData.version}>
      {(this.state.tableData) && this.renderTabView()}
    </div>
  )
}
}


export default TableView

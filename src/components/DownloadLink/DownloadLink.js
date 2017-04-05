import React, {Component, PropTypes} from 'react'
import {FontIcon} from 'react-toolbox'
import {getFile} from '../../utils/utils'
import classes from './DownloadLink.scss'

const isImageByExt = (media:string):boolean => (media ? media.toLowerCase().match(/jpg|png|jpeg|bmp|gif/) : false)
const isPdfByExt = (media:string):boolean => (media ? media.toLowerCase().match(/pdf/) : false)

export class DownloadLink extends Component {
  state = {
    data: 'data:'
  }

  static propTypes = {
    href: PropTypes.string,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    text: PropTypes.string,
    type: PropTypes.oneOf(['photo', 'schematic', 'layout', 'other']),
    existingFile: PropTypes.string,
    uploadname: PropTypes.string
  }

  customSetState = (value, stateObject) => {
    this.setState({...this.state, [stateObject]: value.target.result})
  }

  componentDidMount = () => {
    const {existingFile, uploadname} = this.props
    // console.log('DL:existingfile:', existingFile)
    // console.log('DL:uploadname:', uploadname)
    if (!uploadname) {
      this.setState({data: existingFile})
    } else {
      getFile(existingFile, uploadname, 'attachment', this.customSetState, 'data')
    }
  }
  // Safari IOS specific detection
  getContentType = () => {
    const {existingFile} = this.props
    if (isImageByExt(existingFile)) {
      return 'image/jpeg'
    } else if (isPdfByExt(existingFile)) {
      return 'application/pdf'
    } else {
      return 'attachment/file'
    }
  }

  render = () => {
    const {icon, text, existingFile, uploadname} = this.props
    let ua = global.navigator.userAgent
    var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i)
    var webkit = !!ua.match(/WebKit/i)
    var iOSSafari = iOS && webkit && !ua.match(/CriOS/i)
    var Safari = webkit && !ua.match(/CriOS/i)
    return (
      <div>
        <a href={iOSSafari ? this.state.data.replace(/^data:[^;]*;/, 'data:' + this.getContentType() + ';') : this.state.data} target='_blank'
          download={uploadname ? (existingFile ? existingFile.substring(existingFile.lastIndexOf('/') + 1) : 'download') : ''}>
          <span><FontIcon className={classes.actionIcons} value={icon} /> {text} </span>
        </a>
      </div>
    )
  }
}

export default DownloadLink

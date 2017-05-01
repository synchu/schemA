import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {FontIcon} from 'react-toolbox'
import {getFile} from '../../utils/utils'
import classes from './DownloadLink.scss'

const isImageByExt = (media:string):boolean => (media ? media.toLowerCase().match(/jpg|png|jpeg|bmp|gif/) : false)
const isPdfByExt = (media:string):boolean => (media ? media.toLowerCase().match(/pdf/) : false)
const downloadPath = 'https://schematics.synchu.com/'
/**
 * Returns a download link component
 * 
 * @export
 * @class DownloadLink
 * @extends {Component}
 */
export class DownloadLink extends Component {

  static propTypes = {
    existingFile: PropTypes.string,
    href: PropTypes.string,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    text: PropTypes.string,
    type: PropTypes.oneOf(['photo', 'schematic', 'layout', 'other']),
    uploadname: PropTypes.string
  }

  state = {
    data: 'data:'
  }

  componentDidMount = () => {
    const {existingFile, uploadname} = this.props
    // console.log('DL:existingfile:', existingFile)
    // console.log('DL:uploadname:', uploadname)
    if (!uploadname) {
      // console.log('existingFile', existingFile)
      this.setState({data: downloadPath + existingFile})
    } else {
      getFile(existingFile, uploadname, 'attachment', this.customSetState, 'data')
    }
  }

  /**
   * Used as callback passed to another function and set state with whatever the referenced
   * function comes out with
   * 
   * @memberof DownloadLink
   */
  customSetState = (value, stateObject) => {
    this.setState({...this.state, [stateObject]: value.target.result})
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
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === '[object SafariRemoteNotification]' })(!window['safari'] || safari.pushNotification)
    return (
      <div>
        <a href={iOSSafari || isSafari ? this.state.data.replace(/^data:[^;]*;/, 'data:' + this.getContentType() + ';') : this.state.data} target='_blank'
          download={uploadname ? (existingFile ? existingFile.substring(existingFile.lastIndexOf('/') + 1) : 'download') : ''}
        >
          <span><FontIcon className={classes.actionIcons} value={icon} /> {text} </span>
        </a>
      </div>
    )
  }
}

export default DownloadLink

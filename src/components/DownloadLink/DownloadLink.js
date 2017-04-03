import React, {Component, PropTypes} from 'react'
import {FontIcon} from 'react-toolbox'
import {getFile} from '../../utils/utils'
import classes from './DownloadLink.scss'

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

  render = () => {
    const {icon, text, existingFile, uploadname} = this.props
    return (
      <div>
        <a href={this.state.data} target='_blank'
          download={uploadname ? (existingFile ? existingFile.substring(existingFile.lastIndexOf('/') + 1) : 'download') : ''}>
          <span><FontIcon className={classes.actionIcons} value={icon} /> {text} </span>
        </a>
      </div>
    )
  }
}

export default DownloadLink

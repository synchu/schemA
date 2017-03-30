import React, {PropTypes} from 'react'
import classes from './Dropzone.scss'
import Dropzone from 'react-dropzone'
import {pFileReader} from '../../../utils/utils'
import cx from 'classnames'

const __IMG__BASE_URL = 'https://schematics.synchu.com/'



export class FileDropzone extends React.Component {
  state = {
    files: [],
    image: ''
  }

  static propTypes = {
    uploadedFiles: React.PropTypes.object,
    table: PropTypes.bool,
    processFiles: PropTypes.func,
    rkey: PropTypes.number,
    change: PropTypes.func,
    brand: PropTypes.string,
    model: PropTypes.string,
    changeFields: PropTypes.object,
    idx: PropTypes.number,
    existingId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    existingFile: PropTypes.string,
    custom: PropTypes.object,
    uploadFile: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.onDrop = this
      .onDrop
      .bind(this)
  }

  getImage = (existingFile, uploadFile) => {
    var formData = new FormData()
    formData.append('file', existingFile)
    formData.append('return', 'inline')
    formData.append('uploadedname', uploadFile)

    fetch('https://schematics.synchu.com/getfile.php', {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: formData
    })
    .then(response => response.blob())
    .then(blob => {
      pFileReader(blob)
      .then(result => {
        this.setState({
          ...this.state,
          image: result.target.result
        })
      }, error => console.log(error))
    }
      )
    .catch(error => {
      console.error(error)
      return false
    })
  }


  onDrop (files) {
    const {
      processFiles,
      change,
      brand,
      model,
      changeFields,
      custom,
      idx,
      existingId,
      existingFile,
      uploadFile
    } = this.props
    this.setState({
      ...this.state,
      files: files
    })
    processFiles && processFiles(files, change, changeFields, brand, model, custom, idx, existingId)
  }

  componentDidMount = () => {
    const {existingFile, uploadFile} = this.props
    if (uploadFile) {
      this.getImage(existingFile, uploadFile)
    }
  }

  render () {
    const {table, existingFile, existingId, uploadFile} = this.props
    const {files} = this.state
    return (
      <div
        key={this.props.rkey}
        style={{
          display: 'flex',
          flex: '1',
          margin: 'auto'
        }}>
        <Dropzone
          onDrop={this.onDrop}
          title={`Drag or click to ${existingFile
          ? 'replace'
          : 'upload'} file`}
          className={!table
          ? cx(classes.dropzoneContainer)
          : cx(classes.tableContainer)}>
          <div
            style={{
              margin: files.length > 0
              ? '0px'
              : '3px'
            }}>
            {files.length === 0 && `Drag or click to ${existingFile
              ? 'replace'
              : 'upload'} file`}
            {files.length > 0 && this
              .state
              .files
              .map((file) => {
                return (
                  <div key={this.props.rkey + file.name}>
                    {!table && <div>
                      <img
                        style={{
                          width: '120px',
                          height: '120px'
                        }}
                        src={file.preview} />
                    </div>}
                    {table && <div>
                      <img
                        style={{
                          width: '48px',
                          height: '48px'
                        }}
                        src={file.preview} />
                    </div>}
                  </div>
                )
              })
}
          </div>
        </Dropzone>
        {!uploadFile && existingFile && (existingFile.length > 0) && (existingId > 0) && <a href={__IMG__BASE_URL + existingFile} target='_blank'>
          <img
            style={{
              width: '48px',
              height: '48px'
            }}
            src={__IMG__BASE_URL + existingFile} />
        </a>}
        {uploadFile && (uploadFile.length > 0) && (existingId > 0) && <a href={this.state.image} target='_blank'>
          <img
            style={{
              width: '48px',
              height: '48px'
            }}
            src={this.state.image} />
        </a>}
      </div>
    )
  }
}

export default FileDropzone

import React, {PropTypes} from 'react'
import classes from './Dropzone.scss'
import Dropzone from 'react-dropzone'
import cx from 'classnames'

const __IMG__BASE_URL = 'http://schematics.synchu.com/'

export class FileDropzone extends React.Component {
  state = {
    files: []
  }

  static propTypes = {
    uploadedFiles: React.PropTypes.object,
    table: PropTypes.bool,
    processFiles: PropTypes.func,
    rkey: PropTypes.number,
    change: PropTypes.func,
    brand: PropTypes.string,
    model: PropTypes.string,
    field: PropTypes.string,
    idx: PropTypes.number
  }

  constructor (props) {
    super(props)
    this.onDrop = this.onDrop.bind(this)
  }

  onDrop (files) {
    const { processFiles, change, brand, model, field, custom, idx } = this.props
    this.setState({ ...this.state, files: files })
    processFiles && processFiles(files, change, field, brand, model, custom, idx)
  }

  render () {
    const { table, existingFile, existingId } = this.props
    const { files } = this.state

    return (
    <div key={this.props.rkey} style={{ display: 'flex', flex: '1', margin: 'auto' }}>
      <Dropzone onDrop={this.onDrop} title={`Drag or click to ${existingFile ? 'replace' : 'upload'} file`}
        className={!table ? cx(classes.dropzoneContainer) : cx(classes.tableContainer)}>
        <div style={{margin: files.length > 0 ? '0px' : '3px'}}>
          {files.length === 0 && `Drag or click to ${existingFile ? 'replace' : 'upload'} file`}
          {files.length > 0 && this.state.files.map((file) => {
            return (
              <div key={this.props.rkey + file.name}>
                {!table && <div>
                  <img style={{ width: '120px', height: '120px' }} src={file.preview} />
                </div>}
                {table && <div>
                  <img style={{ width: '48px', height: '48px' }} src={file.preview} />
                </div>}
              </div>
            )
          })
          }
        </div>
      </Dropzone>
      {existingFile && (existingFile.length > 0) && (existingId > 0) && <img style={{ width: '48px', height: '48px' }}
        src={__IMG__BASE_URL + existingFile} />}
    </div>
  )
  }
}



export default FileDropzone

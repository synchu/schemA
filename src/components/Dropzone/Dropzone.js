import React from 'react'
import classes from './Dropzone.scss'
import Dropzone from 'react-dropzone'
import Button from 'react-toolbox/lib/button'

export class FileDropzone extends React.Component {

  constructor (props) {
    super(props)
    console.log(props)
  }

  onDrop (files) {
    console.log(files.name)
  }

  render () {
    return (
      <div>
        <h2 className={classes.dropzoneContainer}>
      Drop or click to upload file:
      {' '}
          <span className={classes['dropzone--green']}>
      props.uploadedFiles
          </span>
        </h2>
        <Dropzone onDrop={this.onDrop}>
          <div>
         Drop some files to upload
          </div>

        </Dropzone>
        <Button label='Upload sound' raised onClick={console.log('upload file clicked')} />

    {' '}
        <Button label='Replace sound' flat onClick={console.log('replace sound')} />
      </div>
  )
  }
}

FileDropzone.propTypes = {
  uploadedFiles: React.PropTypes.object.isRequired
}

export default FileDropzone

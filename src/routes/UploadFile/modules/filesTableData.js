import React, {PropTypes, Component} from 'react'
import {IconButton} from 'react-toolbox'
import TypeSelector from '../components/TypeSelector'
import FileDropzone from '../components/Dropzone'
import {Field, Fields} from 'redux-form/immutable'

export const AmpModel = {
  /*id: {
    type: Number
  },
  data_id: {
    type: Number
  },
  bid: {
    type: Number
  },
  brand: {
    type: String
  },
  model: {
    type: String
  },*/
  version: {
    type: String
  },
  type: {
    type: String
  },
  data: {
    type: String
  },
  filename: {
    type: String
  },
  file: {
    type: Object
  },
  delete: {
    type: Object
  }
}

export const newRow = (newDataId, i, deleteFileData, getState) => {
  return {
    data_id: newDataId,
    id: -1,
    bid: i.bid,
    brand: i.brand,
    model: i.model,
    version: i.version,
    type: <Field
      component={TypeSelector}
      label='Item type'
      type='input'
      name='type'
      selection={i.type} />,
    filename: i.filename,
    file: <Field
      component={FileDropzone}
      label='Click or drag to upload file'
      icon='file'
      type='file'
      name='files'
      multiple
      table />,
    delete: <IconButton icon='delete' onClick={deleteFileData(i.id, getState)} />
  }

}
export const getTableData = (source, deleteFileData, getState) => {
  if (!source || (typeof source === Array)) {
    console.warn('Error with source in getTableData:', source)
    return []
  }

  let result = source.map(i => {
    return {
      id: i.id,
      data_id: i.data_id,
      bid: i.bid,
      brand: i.brand,
      model: i.model,
      version: i.version,
      data: i.data,
      type: <Field
        component={TypeSelector}
        label='Item type'
        type='input'
        name='type'
        selection={i.type} />,
      filename: i.filename,
      file: <Field
        component={FileDropzone}
        label='Click or drag to upload file'
        icon='file'
        type='file'
        name='files'
        multiple
        table />,
      delete: <IconButton icon='delete' onClick={deleteFileData(i.id, getState)} />
    }
  })
  console.log('getTableData:', result)
  return result
}
/*
    id: 1, data_id: 1, bid: 1, brand: 'Fender', model: 'Bassman', version: '5B6',
    type: <Field component={TypeSelector}
      label='Item type'
      type='input'
      name='type'
      selection='schematic'
      />,
    data: <Field component={FileDropzone}
      label='Click or drag to upload file'
      icon='file'
      type='file'
      name='files'
      multiple
      table
      rkey={1} />
}*/

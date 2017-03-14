import React from 'react'
import {IconButton} from 'react-toolbox'

export const newVersionRow = (newDataId, i, id) => {
  return {
    data_id: newDataId,
    id: id,
    bid: i.bid,
    brand: i.brand,
    model: i.model,
    version: i.version,
    file: {},
    type: i.type,
    filename: '',
    contributor: '',
    data: '',
    isfile: 1,
    thumbnail: ''
  }
}

export const getTableData = (source, getState) => {
  if (!source || (typeof source === Array)) {
    console.warn('Error with source in getTableData:', source)
    return []
  }
  let result = source.map((i, index) => ({
    id: i.id,
    data_id: i.data_id,
    bid: i.bid,
    brand: i.brand,
    model: i.model,
    version: i.version,
    data: i.data,
    type: i.type,
    filename: i.filename,
    file: i.file,
    delete: <IconButton icon='delete' />
  }
  )
  )
  console.log('getTableData:', result)
  return result
}

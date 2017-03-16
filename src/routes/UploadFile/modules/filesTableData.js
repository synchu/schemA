import React from 'react'
import {IconButton} from 'react-toolbox'
import {formValueSelector} from 'redux-form/immutable'
import 'isomorphic-fetch'


const selector = formValueSelector('UploadItem')

const handleErrors = (response) => {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

const getLastBid = () => {
  fetch('http://thesubjectmatter.com/api.php/last_bid?transform=1')
    .then(response => handleErrors(response))
    .then(response => response.json())
    .then(json => {
      if (json.last_bid.length === 0) {
        throw Error('No records found')
      }
      return json.last_bid[0].last_bid
    })
    .catch(error => {
      console.error(error)
    })
}

export const initNewBrand = (state, id) => {
  console.log('initnewbrand:', state)
  return ({
    data_id: -id,
    id: id,
    bid: -1,
    brand: selector(state, 'brand'),
    model: selector(state, 'model'),
    version: selector(state, 'version'),
    file: {},
    type: 'Schematic',
    filename: '',
    contributor: '',
    data: '',
    isfile: 0,
    thumbnail: ''
  })
}

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
  }))
  return result
}

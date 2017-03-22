import React from 'react'
import {IconButton} from 'react-toolbox'
import {formValueSelector} from 'redux-form/immutable'
import {mReq, __API__} from '../../../utils/utils'
import 'isomorphic-fetch'

const selector = formValueSelector('UploadItem')

/**
 * Handles
 * @param {*} response
 */
const handleErrors = (response) => {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}
/**
 * retrieves last brand ID value from the database
 */
const getLastBid = () => {
  fetch(mReq(__API__ + '/last_bid?transform=1'))
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
/**
 * Initializes a new record for a brand, given an UploadItem form state and id
 * @param {*} state
 * @param {*} id
 */
export const initNewBrand = (state, id) => {
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
/**
 *
 * @param {*} source
 * @param {*} getState
 */
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
    delete: <IconButton icon='delete' />,
    size: i.size ? i.size : 0,
    uploadName: i.uploadName ? i.uploadName : ''
  }))
  return result
}

/**
 * Returns the amp record with the max data_id value
 * @param {*} data
 */
export const maxDataId = (data: Array) => (data.reduce((a, b) => a.data_id > b.data_id
      ? a.data_id
      : b.data_id))
/**
 * Verifies if an amplifier item exists in the database. Returns an array of existing database records
 * for the particular amp brand, model and version.
 * Accepts either app state (using UploadItem form selector to extract the params) or
 * brand, model, version params. undefined must be passed as state, if brand, model, version params are used.
 * @param {*} state - app state: Object or undefined
 * @param {*} pBrand - amp brand: String
 * @param {*} pModel - amp model: String
 * @param {*} pVersion - amp version: String
 */
export const checkAmpItemExists = (state: Object, pBrand = '', pModel = '', pVersion = '',
                                   dispatchCallback = undefined) => {
  let {brand, model, version} = {}
  if (state) {
    [brand, model, version] = selector(state, 'brand', 'model', 'version')
  } else {
    [brand, model, version] = [pBrand, pModel, pVersion]
  }
  // additional filtering applied, as api.php does not support multiple filters
  let addFilter = []
  addFilter.push({field: 'brand', value: brand})
  addFilter.push({field: 'model', value: model})
  // schematics is filtered by version (supposedly returning the smallest data set)
  fetch(mReq(__API__ + '/schematics?filter=version,eq,') + version + '&transform=1')
            .then(response => handleErrors(response))
            .then(response => response.json())
            .then(json => {
              // obtain the result and apply the additional filtering stored in AddFilter array
              let result = addFilter.length > 0
                  ? json.schematics.filter(item => addFilter.reduce((a, b) => {
                    return (item[a.field] === a.value) && (item[b.field] === b.value)
                  }
                  ))
                  : json.schematics
              // flatMap the result
              let merged = [].concat.apply([], result)
              fetch(mReq(__API__ + '/last_dataid?filter=brand,eq,') + brand + '&transform=1')
               .then(response => handleErrors(response))
               .then(response => response.json())
               .then(json => {
                 if (dispatchCallback) {
                  // call the callback with the result
                   dispatchCallback(merged, json.last_dataid[0].data_id)
                   return true
                 }
               })
              // returns database records extracted
              return merged && merged.length > 0 ? merged : false
            })
            .catch(error => {
              console.error(error)
              return false
            })
  return false
}

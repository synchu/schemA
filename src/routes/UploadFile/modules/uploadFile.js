/* @flow*/

import {fileObject, emptyAmpItem} from '../interfaces/files.js'
import _ from 'lodash'

// ------------------------------------
// Constants
// ------------------------------------
export const UPLOAD_REQUEST = 'UPLOAD_REQUEST'
export const UPLOAD_PUSH = 'UPLOAD_PUSH'
export const UPLOAD_SAVE = 'UPLOAD_SAVE'

export const BRANDS_DROPDOWN_REQUEST = 'BRANDS_DROPDOWN_REQUEST'
export const BRANDS_DROPDOWN_SUCCESS = 'BRANDS_DROPDOWN_SUCCESS'
export const BRANDS_DROPDOWN_ERROR = 'BRANDS_DROPDOWN_ERROR'

export const SET_DESCRIPTION = 'SET_DESCRIPTION'

// ------------------------------------
// Utils
// ------------------------------------

const addKey = (item) => {
  let j = 0

  let resultsArray = []
  item.map((i) => {
    let c
    c = i.constructor === Array ? Object.assign({}, i) : Object.assign({}, [i])
    c = Object.defineProperty(c, 'key', {
      enumerable: true,
      configurable: false,
      writable: false,
      value: j++
    })

    resultsArray.push(c)
  })
  return resultsArray
  // return item.map((i) => Object.assign({}, i, { key: j++ }))
}

const transformAmpsToDropdown = (ampsWithKeys, fromItem, tillItem) => {
  let c = {}
  const transformToAutocomplete = (v) => {
    let b = ''
    for (var i = fromItem; i < tillItem + 1; i++) {
      b = b + v[i] + ' '
    }
    return b.trim()
  }

  ampsWithKeys.map((a) => {
    c = Object.defineProperty(c, a['key'].toString(), {
      enumerable: true,
      configurable: false,
      writable: false,
      value: transformToAutocomplete(a)
    })
  })
  return c
}
// ------------------------------------
// Actions
// ------------------------------------

export function requestBrandsDropdown() {
  return {
    type: BRANDS_DROPDOWN_REQUEST,
    isFetching: true
  }
}

export function errorBrandsDropdown(message: string) {
  return {
    type: BRANDS_DROPDOWN_ERROR,
    errorMessage: message,
    snackMessage: message,
    isFetching: false
  }
}



export function successAmpsDropdown(amps) {
  return {
    type: BRANDS_DROPDOWN_SUCCESS,
    amps: transformAmpsToDropdown(addKey(_.uniq(amps.versions.records.map(i => (i[2])))), 0, 0),
    ampVersions: transformAmpsToDropdown(addKey(amps.versions.records), 0, 2),
    rawdata: amps.versions.records
  }
}

export const fetchBrandsDropdown = () => {
  return (dispatch) => {
    dispatch(requestBrandsDropdown())
    return (
      fetch('http://thesubjectmatter.com/api.php/versions?order=version,asc')
        .then((response) => response.json())
        .then((json) => {
          dispatch(successAmpsDropdown(json))
        }))
  }
}

export const loadBrandsDropdown = () => {
  // TODO: caching and pagination
  return (dispatch, getState) => {
    if (getState().Home.ampVersions && (getState().Home.ampVersions.length > 0)) {
      console.log('amp versions cache hit')
      return
    }
    return dispatch(fetchBrandsDropdown())
  }
}

export const setDescription = (value) => {
  return (dispatch) => {
    dispatch(
      {
        type: SET_DESCRIPTION,
        description: value
      })
  }
}

export const actions = {
  loadBrandsDropdown
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [UPLOAD_REQUEST]: (state, action) => state + action.payload,
  [UPLOAD_PUSH]: (state, action) => state,
  [UPLOAD_SAVE]: (state, action) => state,
  [BRANDS_DROPDOWN_REQUEST]: (state, action) => Object.assign({}, state,
    { isFetching: true }),
  [SET_DESCRIPTION]: (state, action) => Object.assign({}, state,
    { description: action.description }),
  [BRANDS_DROPDOWN_ERROR]: (state, action) => Object.assign({}, state,
    { isFetching: false, errorMessage: action.errorMessage, snackMessage: action.snackMessage }),
  [BRANDS_DROPDOWN_SUCCESS]: (state, action) => Object.assign({}, state,
    { isFetching: false, ampVersions: action.ampVersions, amps: action.amps, rawdata: action.rawdata })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isFetching: false,
  snackMessage: '',
  errorMessage: '',
  amps: [],
  models: [],
  versions: [],
  rawdata: [],
  ampVersions: []
}

export default function uploadFileReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

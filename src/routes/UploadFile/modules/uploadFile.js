/* @flow*/

import {fileObject, emptyAmpItem} from '../interfaces/files.js'
import fetch from 'isomorphic-fetch'
import _ from 'lodash'

// ------------------------------------ Constants
// ------------------------------------
export const UPLOAD_REQUEST = 'UPLOAD_REQUEST'
export const UPLOAD_PUSH = 'UPLOAD_PUSH'
export const UPLOAD_SAVE = 'UPLOAD_SAVE'

export const BRANDS_DROPDOWN_REQUEST = 'BRANDS_DROPDOWN_REQUEST'
export const BRANDS_DROPDOWN_SUCCESS = 'BRANDS_DROPDOWN_SUCCESS'
export const BRANDS_DROPDOWN_ERROR = 'BRANDS_DROPDOWN_ERROR'

export const SET_VERSION = 'SET_VERSION'
export const SET_BRAND = 'SET_BRAND'
export const SET_MODEL = 'SET_MODEL'

// ------------------------------------ Utils
// ------------------------------------

const addKey = (item) => {
  let j = 0

  let resultsArray = []
  item.map((i) => {
    let c
    c = i.constructor === Array
      ? Object.assign({}, i)
      : Object.assign({}, [i])
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
// ------------------------------------ Actions
// ------------------------------------

export const requestBrandsDropdown = () => {
  return {type: BRANDS_DROPDOWN_REQUEST, isFetching: true}
}

export const errorBrandsDropdown = (message : string) => {
  return {type: BRANDS_DROPDOWN_ERROR, errorMessage: message, snackMessage: message, isFetching: false}
}

export const successAmpsDropdown = (amps) => {
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
    return (fetch('http://thesubjectmatter.com/api.php/versions?order=version,asc').then((response) => response.json()).then((json) => {
      dispatch(successAmpsDropdown(json))
    }).catch(error => {
      console.error('Load brands dropdown error:', error)
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

export const setBrand = (value) => {
  return (dispatch, getState) => {
    let c = {}
    let foundBrand = getState().uploadFile.amps[value]
    _.uniqBy(getState().uploadFile.rawdata.filter((i) => i[2] === getState().uploadFile.amps[value]), '1').map(a => {
      c = Object.defineProperty(c, a[1], {
        enumerable: true,
        configurable: false,
        writable: false,
        value: a[1]
      })
    })
    dispatch({type: SET_BRAND, brand: foundBrand, models: c})
  }
}

export const setModel = (model) => {
  return (dispatch, getState) => {
    let c = {}
    const brand = getState().uploadFile.brand
    _.uniqBy(getState().uploadFile.rawdata.filter((i) =>
    (i[1] === model) && (i[2] === brand)),
    '0')
    .map(a => {
      c = Object.defineProperty(c, a[0], {
        enumerable: true,
        configurable: false,
        writable: false,
        value: a[0]
      })
    })
    dispatch({type: SET_MODEL, model: model, versions: c})
  }
}

export const setVersion = (version) => {
  return (dispatch, getState) => {
    console.log('version:', version)
    const brand = getState().uploadFile.brand
    const model = getState().uploadFile.model
    fetch('http://thesubjectmatter.com/api.php/schematics?filter=version,eq' +
          ',' + version.trim() + '&transform=1')
          .then((response) => response.json())
          .then((json) => {
            return json.schematics.filter(i => i.model.toLowerCase() ===
            model.toLowerCase().trim() && i.brand.toLowerCase() === brand.toLowerCase().trim())
          })
          .then(item => {
            console.log(item)
            return dispatch({type: SET_VERSION, versionData: item})
          })
          .catch(r => console.log(r))
    return dispatch({type: SET_VERSION, versionData: {}})
  }
}

export const actions = {
  loadBrandsDropdown
}

// ------------------------------------ Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [UPLOAD_REQUEST]: (state, action) => state + action.payload,
  [UPLOAD_PUSH]: (state, action) => state,
  [UPLOAD_SAVE]: (state, action) => state,
  [BRANDS_DROPDOWN_REQUEST]: (state, action) => Object.assign({}, state, {isFetching: true}),
  [BRANDS_DROPDOWN_ERROR]: (state, action) => Object.assign({}, state, {
    isFetching: false,
    errorMessage: action.errorMessage,
    snackMessage: action.snackMessage
  }),
  [BRANDS_DROPDOWN_SUCCESS]: (state, action) => Object.assign({}, state, {
    isFetching: false,
    ampVersions: action.ampVersions,
    amps: action.amps,
    rawdata: action.rawdata
  }),
  [SET_BRAND]: (state, action) => Object.assign({}, state, {
    brand: action.brand, models: action.models
  }),
  [SET_MODEL]: (state, action) => Object.assign({}, state, {
    model: action.model, versions: action.versions
  }),
  [SET_VERSION]: (state, action) => Object.assign({}, state, {
    version: action.version, description: action.description, versionData: action.versionData
  })
}

// ------------------------------------ Reducer
// ------------------------------------
const initialState = {
  isFetching: false,
  snackMessage: '',
  errorMessage: '',
  amps: [],
  models: {},
  versions: {},
  rawdata: [],
  ampVersions: []
}

export default function uploadFileReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler
    ? handler(state, action)
    : state
}

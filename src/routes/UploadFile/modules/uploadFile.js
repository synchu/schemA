/* @flow*/

import {fileObject, emptyAmpItem} from '../interfaces/files.js'
import {getTableData, newVersionRow, initNewBrand, maxDataId, getLastBid} from './filesTableData'
import fetch from 'isomorphic-fetch'
import {formValueSelector} from 'redux-form/immutable'
import {updateField, insertRecord, deleteRecord} from '../../../utils/updateDb'
import {deepCompareFiles, findInObj} from './uploadUtils'
import {mReq, __API__} from '../../../utils/utils'
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
export const SET_FILES = 'SET_FILES'

export const SET_ERROR = 'SET_ERROR'

export const SET_LAST_NEWID = 'SET_LAST_NEWID'

export const START_PROGRESS = 'START_PROGRESS'
export const INCREASE_PROGRESS = 'INCREASE_PROGRESS'
export const STOP_PROGRESS = 'STOP_PROGRESS'

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

const selector = formValueSelector('UploadItem')
// ------------------------------------ Actions
// ------------------------------------

export const startProgress = () => {
  return dispatch => {
    dispatch({type: START_PROGRESS})
  }
}

export const increaseProgress = (val = 0) => {
  return (dispatch, getState) => {
    dispatch({
      type: INCREASE_PROGRESS,
      payload: val !== 0
        ? val
        : getState().uploadFile.progress + 10
    })
  }
}

export const stopProgress = () => {
  return (dispatch) => {
    setTimeout(() => dispatch({type: STOP_PROGRESS}), 1200)
  }
}

export const validateFormData = (newData) => {}

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
    return (fetch(mReq(__API__ + '/versions?order=version,asc')).then((response) => response.json()).then((json) => {
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

export const setBrand = (value, change, array) => {
  return (dispatch, getState) => {
    let c = {}
    // TODO: Find the fix - a tricky bit, since Autocomplete box selection  returns
    // index when selected from the list, but text value when not. We need to find
    // out reliably whether there's a match in the DB
    const findBrand = () => getState().uploadFile.amps[value] === undefined
      ? (findInObj(getState().uploadFile.amps, value)
        ? value
        : false)
      : getState().uploadFile.amps[value]

    let foundBrand = findBrand()
    _.uniqBy(getState().uploadFile.rawdata.filter((i) => i[2] === foundBrand), '1').map(a => {
      c = Object.defineProperty(c, a[1], {
        enumerable: true,
        configurable: false,
        writable: false,
        value: a[1]
      })
    })
    dispatch({
      type: SET_BRAND,
      /* brand: !foundBrand ? value : foundBrand, */
      models: c
    })
    setModel('', change, array)(dispatch, getState)
    if (change) {
      change('version', '')
      change('model', '')
    }
    setVersion('', change, array)(dispatch, getState)
  }
}

export const setModel = (model, change, array) => {
  return (dispatch, getState) => {
    let c = {}
    const brand = selector(getState(), 'brand')
    _.uniqBy(getState().uploadFile.rawdata.filter((i) => (i[1] === model) && (i[2] === brand)), '0').map(a => {
      c = Object.defineProperty(c, a[0], {
        enumerable: true,
        configurable: false,
        writable: false,
        value: a[0]
      })
    })
    dispatch({type: SET_MODEL, versions: c})
    setVersion('', change, array)(dispatch, getState)
    dispatch({
      type: SET_VERSION,
      versionData: [],
      descriptionDb: '',
      filesData: [],
      description: '',
      contributor: '',
      version: ''
    })
  }
}

export const setVersion = (version, change, array) => {
  return (dispatch, getState) => {
    const brand = selector(getState(), 'brand')
    const model = selector(getState(), 'model')
    if (!brand || !model || !version || (version === '')) {
      if (change) {
        change('description', '')
        change('contributor', '')
        change('version', '')
        if (array) {
          array.removeAll('files')
        }
        dispatch({type: SET_FILES, filesData: [], versionData: []})
      }
      return
    }
    fetch(mReq(__API__ + '/schematics?filter=version,eq,') + version.trim() + '&transform=1').then((response) => response.json()).then((json) => {
      return json
        .schematics
        .filter(i => i.model.toLowerCase() === model.toLowerCase().trim() && i.brand.toLowerCase() === brand.toLowerCase().trim())
    }).then(item => {
      let descriptionLine = item.filter(i => i.type.trim().toLowerCase() === 'description')[0]
      let descriptionDb = descriptionLine
        ? descriptionLine.data
        : ''
      let contributor = descriptionLine
        ? descriptionLine.contributor
        : ''
      let fileData = item.filter(i => i.type.trim().toLowerCase() !== 'description')
      // change form values
      if (change) {
        change('description', descriptionDb)
        change('contributor', contributor)
      }
      if (array) {
        fileData.map(i => array.push('files', i))
      }
      return dispatch({
        type: SET_VERSION,
        versionData: item,
        descriptionDb: descriptionDb,
        filesData: getTableData(fileData, getState),
        version: version
      })
    }).catch(r => console.log(r))
    return dispatch({type: SET_VERSION, versionData: [], descriptionDb: '', filesData: []})
  }
}

export const setFilesData = (row, key, value) => {
  return (dispatch, getState) => {
    let filesData = getState().uploadFile.filesData
    filesData[row][key] = value
    return dispatch({type: SET_FILES, filesData: filesData})
  }
}

export const setVersionData = (idrow, key, value) => {
  return (dispatch, getState) => {
    let versionData = getState().uploadFile.versionData
    let i = 0
    let foundIndex: Number = -99999
    while (i < versionData.length) {
      if (versionData[i].id === idrow) {
        foundIndex = i
        break
      }
      i++
    }
    if (foundIndex !== -99999) {
      versionData[foundIndex][key] = value
      return dispatch({
        type: SET_FILES,
        versionData: versionData,
        filesData:
          getTableData(versionData.filter(i => i.type.trim().toLowerCase() !== 'description'), getState)
      })
    } else {
      console.error('setVersionData: RowIndex not found:', idrow)
      return
    }
  }
}

export const deleteFileData = (rowId, idx, array) => {
  return (dispatch, getState) => {
    let foundRow = -1
    let filesData = getState().uploadFile.filesData
    let versionData = getState().uploadFile.versionData
    for (var i = 0; i < filesData.length; i++) {
      if (filesData[i].id === rowId) {
        foundRow = i
        break
      }
    }
    if (foundRow > -1) {
      let deletedFilesData = getState().uploadFile.deletedFilesData
        ? getState()
          .uploadFile
          .deletedFilesData
          .concat(filesData.splice(i, 1))
        : []

      foundRow = -1

      for (var j = 0; j < versionData.length; j++) {
        if (versionData[j].id === rowId) {
          foundRow = j
          break
        }
      }
      if (foundRow > -1) {
        var deletedVersionData = getState().uploadFile.deletedVersionData
          ? getState()
            .uploadFile
            .deletedVersionData
            .concat(versionData.splice(j, 1))
          : []
      }
      if (array) {
        array.remove('files', idx)
      } else {
        console.warn('no array present')
      }
      dispatch({type: SET_FILES, filesData: filesData, versionData: versionData, deletedFilesData: deletedFilesData, deletedVersionData: deletedVersionData})
    } else {
      return
    }
  }
}

export const setDataField = (data, index) => {
  return (dispatch, getState) => {
    let filesData = getState().uploadFile.filesData
    let versionData = getState().uploadFile.versionData

    filesData[index].data = data

    let foundRow = -1

    for (var j = 0; j < versionData.length; j++) {
      if (versionData[j].id === filesData[index].id) {
        foundRow = j
        break
      }
    }
    if (foundRow > -1) {
      versionData[foundRow].data = data
    } else {
      console.warn('Strange days are coming. Version Data differs from files data:', filesData, versionData)
    }
    dispatch({type: SET_FILES, filesData: filesData, versionData: versionData})
  }
}

export const addNewTableRow = (change, array) => {
  return (dispatch, getState) => {
    let versionData = getState().uploadFile.versionData

    let newDataId = versionData && versionData.length > 0
      ? parseInt(maxDataId(versionData)) + 1
      : 1
    let id = getState().uploadFile.lastNewID
      ? getState().uploadFile.lastNewID - 1
      : -1

    var dataInit = versionData[0]
      ? versionData[0]
      : initNewBrand(getState(), newDataId)
    // make sure the type is schematic
    dataInit.type = 'Schematic'

    let newVersionItem = newVersionRow(newDataId, dataInit, id)

    let newVersionData = getState()
      .uploadFile
      .versionData
      .concat([newVersionItem])
    dispatch({type: SET_LAST_NEWID, lastNewID: id})

    if (array) {
      array.push('files', newVersionItem)
    } else {
      console.warn('no array present')
    }

    return dispatch({
      type: SET_FILES,
      filesData: getTableData(newVersionData.filter(i => i.type.trim().toLowerCase() !== 'description'), getState),
      versionData: newVersionData
    })
  }
}

const ir = (bid: Number, brand: String, model: String, version: String,
  type: String, data: String, contributor: String,
  fileName: String = '', isFile: Number = 0, thumbnail: String = '', size: Number = 0,
  uploadname: String = ''): Object => ({
    bid: bid,
    brand: brand,
    model: model,
    version: version,
    type: type,
    data: data,
    contributor: contributor,
    filename: fileName,
    isFile: isFile,
    thumbnail: thumbnail,
    size: size,
    uploadname: uploadname
  })

 /**
 * Submits form to the database. Updates and creates records where necessary.
 *
 * @param {Array} existingRecords - array of amplifier item record objects
 * @param {Number} maxDataId - current max data_id key within the current brand
 * @returns void
 */
export const submitToDB = (existingRecords, maxDataId) => {
  return (dispatch, getState) => {
    const {brand, model, version, description, contributor} = selector(getState(), 'brand', 'model', 'version', 'description', 'contributor')

    const bid = existingRecords[0]
      ? existingRecords[0].bid
      : -1
    const profile = getState()
      .globalReducer
      .auth
      .getProfile()

    var newDataId = parseInt(maxDataId < 0 ? -maxDataId : maxDataId) + 1

    dispatch(increaseProgress(20))
     
    // verify that we have existing records
    if (existingRecords[0]) {
      // descriptions processing start
      let descriptionDBRecord = existingRecords.filter(i => i.type.trim().toLowerCase() === 'description')
      if (descriptionDBRecord && descriptionDBRecord.length > 0) {
        // update existing description record if necessary
        if (descriptionDBRecord[0].data !== description) {
          updateField('description', description, undefined, descriptionDBRecord[0])
        }
        if (descriptionDBRecord[0].contributor !== contributor) {
          updateField('contributor', contributor, undefined, descriptionDBRecord[0])
        }
        dispatch(increaseProgress(60))
      } else {
        // new description record create and increase newDataId, should there are any new file items to be inserted
        insertRecord(ir(bid, brand, model, version, 'Description', description, contributor, '', 0, ''), newDataId++)

        // descriptions processing end
        dispatch(increaseProgress(60))
      }
      // obtain file items from the DB
      let filesRecords: Array<Object> = existingRecords.filter(i => i.type.trim().toLowerCase() !== 'description')
      // obtain file items from the on-screen form
      let filesForm: Array<Object> = selector(getState(), 'files')
      // compare the above and obtain what needs to be updated
      let dbUpdates: Object = deepCompareFiles(filesForm, filesRecords)
      // first update the changed values
      if (dbUpdates.changes) {
        dbUpdates.changes.map(i => updateField(i.field, i.value, undefined, {id: i.id}))
      }
      // check if there are any new records added
      let newRecords = dbUpdates.records.filter(i => i.id < 0)
      // console.log('submitToDb: newRecords:', newRecords)
      if (newRecords) {
        newRecords.map(item => (insertRecord(ir(item.bid,
        item.brand,
        item.model,
        item.version,
        item.type,
        item.data,
        item.contributor,
        item.filename,
        item.isFile,
        item.thumbnail,
        item.size,
        item.uploadname), newDataId++)))
      }
      dispatch(increaseProgress(80))
    } else {
      // There are no existing records, so we are creating a new brand
      // obtain last brand id
      dispatch(increaseProgress(60))
      getLastBid()
      .then(lastBid => {
        // console.log(lastBid)
        if (!insertRecord(ir(lastBid + 1, brand, model, version, 'Description', description, contributor, '', 0, ''), newDataId++)) {
          console.warn('Description did not make it to the DB')
        }
        let filesRecords: Array<Object> = existingRecords.filter(i => i.type.trim().toLowerCase() !== 'description')
        let filesForm: Array<Object> = selector(getState(), 'files')
        let dbUpdates: Object = deepCompareFiles(filesForm, filesRecords)
        if (dbUpdates.changes[0]) {
          dbUpdates.changes.map(i => updateField(i.field, i.value, undefined, {id: i.id}))
        }
        dispatch(increaseProgress(75))
      // check if there are any new records added
        let newRecords = dbUpdates.records.filter(i => i.id < 0)
        if (newRecords) {
          newRecords.map(item => (insertRecord(ir(lastBid + 1,
        item.brand,
        item.model,
        item.version,
        item.type,
        item.data,
        contributor,
        item.filename,
        item.isFile,
        item.thumbnail,
        item.size,
        item.uploadname), newDataId++)))
        }
        dispatch(increaseProgress(85))
      }
      )
    }

    let deletedVersionData = getState().uploadFile.deletedVersionData
    let deletedRecords = deletedVersionData.filter(i => i.id > 0)
    if (deletedRecords) {
      deletedRecords.map(i => deleteRecord(i.id))
    }

    dispatch(increaseProgress(100))
    dispatch(stopProgress())
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
    /* brand: action.brand,*/
    models: action.models
  }),
  [SET_MODEL]: (state, action) => Object.assign({}, state, {
    /* model: action.model,*/
    versions: action.versions
  }),
  [SET_VERSION]: (state, action) => Object.assign({}, state, {
    /* version: action.version,*/
    descriptionDb: action.descriptionDb,
    versionData: action.versionData,
    filesData: action.filesData,
    description: action.description,
    contributor: action.contributor
  }),
  [SET_FILES]: (state, action) => Object.assign({}, state, {
    filesData: action.filesData,
    versionData: action.versionData
      ? action.versionData
      : state.versionData,
    deletedFilesData: action.deletedFilesData
      ? action.deletedFilesData
      : state.deletedFilesData,
    deletedVersionData: action.deletedVersionData
      ? action.deletedVersionData
      : state.deletedVersionData
  }),
  [SET_ERROR]: (state, action) => Object.assign({}, state, {errorMessage: action.errorMessage}),
  [SET_LAST_NEWID]: (state, action) => Object.assign({}, state, {lastNewID: action.lastNewID}),
  [START_PROGRESS]: (state, action) => Object.assign({}, state, {progress: 10}),
  [INCREASE_PROGRESS]: (state, action) => Object.assign({}, state, {progress: action.payload}),
  [STOP_PROGRESS]: (state, action) => Object.assign({}, state, {progress: 0})
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
  ampVersions: [],
  description: '',
  contributor: '',
  descriptionDb: '',
  filesData: [],
  deletedFilesData: [],
  deletedVersionData: [],
  brand: '',
  model: '',
  version: ''
}

export default function uploadFileReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler
    ? handler(state, action)
    : state
}

import {mReq, __API__} from './utils'

export const getDBFieldName = (cardField) => {
  let fieldName = ''
  // if there's no _ in field name then it is not ModelItem form - hence return immeditely
  if (cardField && cardField.indexOf('_') === -1) {
    return cardField
  }
  if (cardField && cardField.length > 0) {
    let i = cardField.length - 1

    while (i !== 0 && cardField[i] !== '_') {
      fieldName += cardField[i--]
    }

    return fieldName
            .split('')
            .reverse()
            .join('')
  } else {
    return ''
  }
}


/**
 * Deletes a file item fron the database, provided the app user has the appropriate permissions.
 * Function is provided for completeness purposes. Generally, items deletion must happen via direct DB maintenance by an admin.
 * @param {Number} recId - Record id number to delete
 */
export const deleteRecord = (recId: Number): void => {
  if (recId <= 0) {
    console.error('Delete record id is incorrect')
    return
  }
  console.log(__API__ + '/schematics/' + recId)
  fetch(mReq(__API__ + '/schematics/' + recId), {
    method: 'DELETE'/*,
    headers: {
      'Accept': 'text/plain',
      'Content-Type': 'text/plain'
    }*/
  })
          .then(response => handleErrors(response))
          .then(response => response.json())
          .then(json => {
            console.log(json)
            if (json === null) {
              console.log('Nothing deleted! Check with application admin. Permissions might be set wrong.')
            }
            return true
          })
          .catch(error => {
            console.error(error)
            return false
          })
}

/**
 * Inserts a new record into the amplifier database. Both params are mandatory.
 * @param {*} recData - Record data to be inserted
 * @param {*} newDataId - New record data_id - i.e. max(data_id) + 1 within the brand
 */
export const insertRecord = (recData: Object, newDataId: Number) => {
  if (!recData) {
    console.error('No record data provided to insert!')
    return false
  }
  if (!newDataId) {
    console.error('No recordId provided to insertRecord!')
    return false
  }

  let data = {
    bid: recData.bid,
    data_id: newDataId,
    brand: recData.brand,
    model: recData.model,
    version: recData.version,
    type: recData.type ? recData.type : 'Description',
    data: recData.data ? recData.data : '',
    contributor: recData.contributor ? recData.contributor : 'System',
    isFile: recData.isFile ? recData.isFile : 0,
    filename: recData.filename ? recData.filename : '',
    thumbnail: recData.thumbnail ? recData.thumbnail : '',
    datestamp: new Date(),
    size: recData.size ? recData.size : 0,
    uploadname: recData.uploadname ? recData.uploadname : ''
  }

  fetch(mReq(__API__ + '/schematics'), {
    method: 'POST',
    dataType: 'json',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
          .then(response => handleErrors(response))
          .then(response => response.json())
          .then(json => {
            console.log(json)
            return true
          })
          .catch(error => {
            console.error(error)
            return false
          })
}

const doInsertDescription = (field, itemData, value) => {
  fetch(mReq(__API__ + '/schematics'), {
    method: 'POST',
    dataType: 'json',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      bid: itemData.bid,
      data_id: parseInt(itemData.maxDataId) + 1,
      brand: itemData.brand,
      model: itemData.model,
      version: itemData.version,
      type: 'Description',
      data: value,
      contributor: 'System',
      isFile: 0,
      filename: '',
      thumbnail: ''
    })
  })
          .then(response => handleErrors(response))
          .then(response => response.json())
          .then(json => {
            console.log(json)
            return true
          })
          .catch(error => {
            console.log(error)
            return false
          })
  return true
}

const doUpdate = (recordid, field, newvalue) => {
  fetch(mReq(__API__ + '/schematics/') + recordid, {
    method: 'PUT',
    dataType: 'json',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({[field]: newvalue})
  })
            .then(response => handleErrors(response))
            .then(response => response.json())
            .then(json => {
              console.log(json)
              return true
            })
            .catch(error => {
              console.log(error)
              return false
            })
  return true
}

const handleErrors = (response) => {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

/**
/* Updates a field in the database either from the inline ediding or Edit/Create item form
/* TODO: unify source data records
/* @param {*} field - field name
/* @param {*} value - new field value
/* @param {*} itemData - ModelItem (inline) editing data
/* @param {*} recData - Edit/Create item form
/*/
export const updateField = (field, value, itemData, recData = undefined) => {
  const f = getDBFieldName(field)
  let multiRecUpdate = false
  let addFilter = []
  let filterRecId = -1
  let substFieldName = ''

  console.log('about to update field:', f)
  if (itemData && value.trim() === itemData[f].trim()) {
    console.log('Nothing to update. Old and new values are equal for:', itemData)
    return true
  }
  switch (f) {
    case 'version':
      multiRecUpdate = true
      addFilter.push({field: 'brand', value: itemData.brand.trim()})
      break
    case 'brand':
      multiRecUpdate = true
      break
    case 'description':
      filterRecId = recData ? recData.id : itemData.descriptionId
      substFieldName = 'data'
      break
    case 'contributor':
      filterRecId = recData.id
      break
    case 'model':
      multiRecUpdate = true
      addFilter.push({field: 'brand', value: itemData.brand.trim()})
      addFilter.push({field: 'version', value: itemData.version.trim()})
      break
    case 'filename':
    case 'data':
    case 'file':
    case 'type':
    case 'isFile':
    case 'size':
    case 'uploadname':
      filterRecId = recData ? recData.id : -1
      break
  }

  if (multiRecUpdate) {
    fetch(mReq(__API__ + '/schematics?filter=') + f + ',eq,' + itemData[f].trim() + '&transform=1')
            .then(response => handleErrors(response))
            .then(response => response.json())
            .then(json => {
              let result = addFilter.length > 0
                  ? json.schematics.filter(item => addFilter.reduce((a, b) => {
                    return (item[a.field] === a.value) && (item[b.field] === b.value)
                  }
                  ))
                  : json.schematics
              let merged = [].concat.apply([], result)
              merged.map(a => doUpdate(a.id, f, value))
              return
            })
            .catch(error => {
              console.log(error)
            })
  } else {
      // check if a record to be updated exists
    if (filterRecId !== 0) {
      return doUpdate(filterRecId, substFieldName !== '' ? substFieldName : f, value)
    } else {
      if (f === 'description') {
        return doInsertDescription(f, itemData, value)
      }
    }
  }
}

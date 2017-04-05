const FLAGS = {bid: 1, id: 2, data_id: 2, brand: 4, contributor: 8,
  model: 16, version: 64, data: 128, filename: 256, file: 512, type: 1024, thumbnail: 2048,
  size: 4096, uploadname: 8192}

/**
 * Finds a particular property in an array of objects and compares its value to the value paramater.
 * Returns: true if the value differs and false, if the value is equal
 * @param {*} object
 * @param {*} value
 */
const diffInObj = (property: String, objectsArray: Array<Object>, value: any, id: Number): Boolean => {
  let object = objectsArray.filter(i => i.id === id)[0]
  if (!object) {
    return false
  }
  if (object.hasOwnProperty(property)) {
    if (object[property] !== value) {
      return true
    }
  }
  return false
}

export const deepCompareFiles = (filesForm: Array < Object >, filesDB: Array < Object >): Array < Object > => {
  let changeMap = []
  let result = filesForm.map(i => {
    // if id < 0 then we certainly have a new record
    if (i.id > 0) {
      for (var property in i) {
        if (i.hasOwnProperty(property)) {
          if (diffInObj(property, filesDB, i[property], i.id)) {
            changeMap.push({id: i.id, changed: FLAGS[property], field: property, value: i[property]})
          }
        }
      }
    }
    return i
  })
  return ({records: result, changes: changeMap})
}

export const findInObj = (object, value) => {
  for (var property in object) {
    if (object.hasOwnProperty(property)) {
      if (object[property] === value) {
        return true
      }
    }
  }
  return false
}
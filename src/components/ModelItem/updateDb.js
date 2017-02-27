export const getDBFieldName = (cardField) => {
  let fieldName = ''
  if (!!cardField && cardField.length > 0) {
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

const doInsertDescription = (field, itemData, value) => {
  fetch('http://thesubjectmatter.com/api.php/schematics', {
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
  fetch('http://thesubjectmatter.com/api.php/schematics/' + recordid, {
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

export const updateField = (field, value, itemData) => {
  const f = getDBFieldName(field)
  let multiRecUpdate = false
  let addFilter = []
  let filterRecId = -1
  let substFieldName = ''

  console.log('about to update field:', f)
  if (value.trim() === itemData[f].trim()) {
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
      filterRecId = itemData.descriptionId
      substFieldName = 'data'
      break
    case 'model':
      multiRecUpdate = true
      addFilter.push({field: 'brand', value: itemData.brand.trim()})
      addFilter.push({field: 'version', value: itemData.version.trim()})
  }

  if (multiRecUpdate) {
    fetch('http://thesubjectmatter.com/api.php/schematics?filter=' + f + ',eq,' + itemData[f].trim() + '&transform=1')
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

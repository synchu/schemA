export const __API__ = 'schematics.synchu.com/api/api.php'

export const pFileReader = (file) => {
  return new Promise((resolve, reject) => {
    var fr = new FileReader()
    fr.onload = resolve  // CHANGE to whatever function you want which would eventually call resolve
    fr.readAsDataURL(file)
  })
}

export const getFile = (existingFile, uploadFile, mode = 'inline', cb = undefined, cbParams = undefined) => {

  if (!uploadFile) {
    return existingFile
  }

  var formData = new FormData()
  formData.append('file', existingFile)
  formData.append('return', mode)
  formData.append('uploadedname', uploadFile)

  fetch('https://schematics.synchu.com/getfile.php', {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: formData
  })
    .then(response => response.blob())
    .then(blob => {
      pFileReader(blob)
      .then(result => {
        if (cb && typeof cb === 'function') {
          cb(result, cbParams)
        } else {
          return result
        }
      }, error => console.log(error))
    }
      )
    .catch(error => {
      console.error(error)
      return false
    })
}

const isHTTPS = () => {
  if (location.protocol !== 'https:') {
    return false
  } else {
    return true
  }
}

/**
 * Switches fetch requests between http and https automatically, based on location uri protocol
 * Since the current production implementation is on https - now it returns https prefixed urls only!
 * @param {*} url
 */
export const mReq = (url: String) => {
  if (isHTTPS()) {
    return 'https://' + url
  } else {
    return 'https://' + url
  }
}

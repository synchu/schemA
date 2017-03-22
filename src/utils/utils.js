export const __API__ = 'schematics.synchu.com/api/api.php'

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

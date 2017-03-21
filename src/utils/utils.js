const isHTTPS = () => {
  if (location.protocol !== 'https:') {
    return false
  } else {
    return true
  }
}

export const mReq = (url: String) => {
  if (isHTTPS()) {
    return 'https://' + url
  } else {
    return 'http://' + url
  }
}


/* @flow*/

import isEmail from 'validator/lib/isEmail'

export const validateEmail: string = (e: string) => {
  return isEmail(e) ? '' : 'Seems to be a problem with your e-mail.'
}

export const validatePassword: string = (password: string, compareToValue: string, compareToName) => {
 // let reN = /[0-9]/
  let reS = /[a-z]/
 // let reL = /[A-Z]/
  if (password && (password.length < 7)) {
    return 'Password must be at least 7 characters long'
  } else if (compareToName && compareToValue && compareToValue === password) {
    return 'Password must not be equal to ' + compareToName
  } else if (!reS.test(password)) {
    return
  } else {
    return ''
  }
}

export const checkUsernameTaken: bool = (username: string) => {
  // TODO: implement bloom filter fetching
  return false
}

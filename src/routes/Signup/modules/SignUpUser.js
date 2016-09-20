/* @flow*/

// import { userObject } from '../interfaces/user.js'
import { validateEmail as ve, checkUsernameTaken } from '../../../utils/validators'

// ------------------------------------
// Constants
// ------------------------------------
export const SIGNUP_REQUEST = 'SIGNUP_REQUEST'
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS'
export const SIGNUP_FAILURE = 'SIGNUP_FAILURE'
export const EMAIL_ERROR = 'EMAIL_ERROR'
export const VALID_EMAIL = 'VALID_EMAIL'
export const UPDATE_EMAIL = 'UPDATE_EMAIL'
export const PASSWORD_ERROR = 'PASSWORD_ERROR'
export const VALID_PASSWORD = 'VALID_PASSWORD'
export const VERIFY_USERNAME = 'VERIFY_USERNAME'
export const ACCEPT_TERMS_CHANGE = 'ACCEPT_TERMS_CHANGE'

// ------------------------------------
// Actions
// ------------------------------------
export function updateEmail (email) {
  return {
    type: UPDATE_EMAIL,
    userEmail: email
  }
}

export function successValidateEmail (email) {
  return {
    type: VALID_EMAIL,
    userEmail: email,
    emailValid: true
  }
}

export function verifyUsername (username) {
  return {
    type: VERIFY_USERNAME,
    username
  }
}

export function emailError (message) {
  return {
    type: EMAIL_ERROR,
    errorMessage: message,
    emailValid: false
  }
}

export function successValidatePassword (pass) {
  return {
    type: VALID_PASSWORD,
    passwordValid: true,
    userPassword: pass
  }
}

export function passwordError (message) {
  return {
    type: PASSWORD_ERROR,
    errorMessage: message,
    passwordValid: false
  }
}

export function requestLogin (creds) {
  return {
    type: SIGNUP_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    creds
  }
}

export function receiveLogin (user) {
  return {
    type: SIGNUP_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    id_token: user.id_token
  }
}

export function loginError (message) {
  return {
    type: SIGNUP_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message
  }
}

export const validateEmail = (email) => {
  return (dispatch) => {
    let msg = ve(email)
    if (msg === '') {
      dispatch(successValidateEmail(email))
    } else {
      dispatch(emailError(msg))
    }
  }
}

export const handleAcceptTermsChange = (val) => {
  return {
    type: ACCEPT_TERMS_CHANGE,
    val
  }
}

export const actions = {
  requestLogin,
  receiveLogin,
  loginError,
  successValidateEmail,
  emailError,
  successValidatePassword,
  passwordError,
  validateEmail,
  updateEmail,
  verifyUsername
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SIGNUP_REQUEST]: (state, action) => Object.assign({}, state,
    { isFetching: true, isAuthenticated: false, user: action.creds }),
  [SIGNUP_SUCCESS]: (state, action) => Object.assign({}, state,
    { isFetching: false, isAuthenticated: true, errorMessage: '' }),
  [SIGNUP_FAILURE]: (state, action) => Object.assign({}, state,
    { isFetching: false, isAuthenticated: false, errorMessage: action.message }),
  [VALID_EMAIL]: (state, action) => Object.assign({}, state,
    {emailValid: true, userEmail: action.userEmail, errorMessage: ''}),
  [EMAIL_ERROR]: (state, action) => {
    return ({ ...state, emailValid: false, errorMessage: action.errorMessage })
  },
  [UPDATE_EMAIL]: (state, action) => {
    return ({...state, userEmail: action.userEmail})
  },
  [VALID_PASSWORD]: (state, action) => Object.assign({}, state,
    {passwordValid: true, userPassword: action.userPassword, isAuthenticated: true}),
  [PASSWORD_ERROR]: (state, action) => Object.assign({}, state,
    { passwordValid: false, errorMessage: action.message }),
  [VERIFY_USERNAME]: (state, action) => {
    let taken: bool = checkUsernameTaken(action.username)
    return ({...state, username: action.username, isUsernameTaken: taken})
  },
  [ACCEPT_TERMS_CHANGE]: (state, action) => {
    return ({...state, acceptterms: !action.val})
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isFetching: true,
  isAuthenticated: localStorage.getItem('playblu_token') !== undefined,
  user: { email: '', firstname: '', lastname: '' },
  userEmail: '',
  userPassword: '',
  emailValid: false,
  passwordValid: false,
  errorMessage: ''
}
export default function signUpReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

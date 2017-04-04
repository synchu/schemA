/* @flow*/

// import { userObject } from '../interfaces/user.js'
import {validateEmail as ve} from '../../../utils/validators'

import {SET_AUTH_ON, SET_AUTH_OFF} from '../../Home/modules/Home'

import fetch from 'isomorphic-fetch'
import {push} from 'react-router-redux'

// ------------------------------------ Constants
// ------------------------------------
export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
export const CLEAR_MESSAGE = 'CLEAR_MESSAGE'
export const EMAIL_ERROR = 'EMAIL_ERROR'
export const VALID_EMAIL = 'VALID_EMAIL'
export const UPDATE_EMAIL = 'UPDATE_EMAIL'
export const PASSWORD_ERROR = 'PASSWORD_ERROR'
export const VALID_PASSWORD = 'VALID_PASSWORD'

// ------------------------------------ Actions
// ------------------------------------
export function updateEmail(email) {
  return {type: UPDATE_EMAIL, userEmail: email}
}

export function successValidateEmail(email) {
  return {type: VALID_EMAIL, userEmail: email, emailValid: true}
}

export function emailError(message) {
  return {type: EMAIL_ERROR, errorMessage: message, emailValid: false}
}

export function successValidatePassword(pass) {
  return {type: VALID_PASSWORD, passwordValid: true, userPassword: pass}
}

export function passwordError(message) {
  return {type: PASSWORD_ERROR, errorMessage: message, passwordValid: false}
}

export function requestLogin(auth) {
  return (dispatch, getState) => {
    /* const auth = new AuthService(__AUTH0_CLIENT_ID__, __AUTH0_DOMAIN__, () => {
      dispatch({type: LOGIN_SUCCESS})
      dispatch({type: SET_AUTH_ON})
      console.log('fom requestLogin: CreateAuthFunc: ', auth.getProfile(auth.getToken()))
    })*/
    const auth = getState().globalReducer.auth
    if (!auth.loggedIn()) {
      auth.login()
    } else {
      dispatch({type: LOGIN_SUCCESS})
      dispatch({type: SET_AUTH_ON})
    }
    return dispatch({type: LOGIN_REQUEST, isFetching: true, isAuthenticated: false})
  }
}

export const loginUser = (e) => {
  return dispatch => (dispatch(receiveLogin(e)))
}

export function receiveLogin(user) {
  return {type: LOGIN_SUCCESS, isFetching: false, isAuthenticated: true, id_token: user.id_token}
}

export function loginError(message) {
  return {type: LOGIN_FAILURE, isFetching: false, isAuthenticated: false, message}
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

const requestLogout = () => {
  return ({type: LOGOUT_REQUEST})
}

const receiveLogout = () => {
  return ({type: LOGOUT_SUCCESS})
}

const lo = () => {
  let myheaders = new Headers()
  myheaders.append('Access-Control-Allow-Origin', '*')

  fetch('https://synchu.eu.auth0.com/v2/logout', {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }).then(response => {
    console.log(response)
  }).catch(error => {
    console.error('Logout error: ', error)
  })
}

export const logoutUser = () => {
  return (dispatch) => {
    localStorage.removeItem('id_token')
    localStorage.removeItem('profile')
    // confirm the local logout at least
    dispatch(receiveLogout())
    dispatch({type: SET_AUTH_OFF})
    // try to clear session cookies with Auth0
    return lo()
  }
}

export const clearMessage = () => {
  return {type: CLEAR_MESSAGE, errorMessage: ''}
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
  loginUser
}

// ------------------------------------ Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [LOGIN_REQUEST]: (state, action) => Object.assign({}, state, {
    isFetching: true,
    isAuthenticated: false,
    user: action.creds
  }),
  [LOGIN_SUCCESS]: (state, action) => Object.assign({}, state, {
    isFetching: false,
    isAuthenticated: true,
    errorMessage: '',
    user: {
      playblu_token: action.playblu_token
    }
  }),
  [LOGIN_FAILURE]: (state, action) => Object.assign({}, state, {
    isFetching: false,
    isAuthenticated: false,
    errorMessage: action.message
  }),
  [LOGOUT_REQUEST]: (state, action) => Object.assign({}, state, {
    isFetching: true,
    isAuthenticated: false
  }),
  [LOGOUT_SUCCESS]: (state, action) => Object.assign({}, state, {
    isFetching: false,
    isAuthenticated: false,
    errorMessage: 'Logged out'
  }),
  [VALID_EMAIL]: (state, action) => Object.assign({}, state, {
    emailValid: true,
    userEmail: action.userEmail,
    errorMessage: ''
  }),
  [EMAIL_ERROR]: (state, action) => {
    return ({
      ...state,
      emailValid: false,
      errorMessage: action.errorMessage
    })
  },
  [UPDATE_EMAIL]: (state, action) => {
    return ({
      ...state,
      userEmail: action.userEmail
    })
  },
  [VALID_PASSWORD]: (state, action) => Object.assign({}, state, {
    passwordValid: true,
    userPassword: action.userPassword,
    isAuthenticated: true
  }),
  [PASSWORD_ERROR]: (state, action) => Object.assign({}, state, {
    passwordValid: false,
    errorMessage: action.message
  }),
  [CLEAR_MESSAGE]: (state, action) => {
    return ({
      ...state,
      errorMessage: ''
    })
  }
}

// ------------------------------------ Reducer
// ------------------------------------
const initialState = {
  isFetching: true,
  isAuthenticated: localStorage.getItem('playblu_token') !== undefined,
  user: {
    email: '',
    firstname: '',
    lastname: ''
  },
  userEmail: '',
  userPassword: '',
  emailValid: false,
  passwordValid: false,
  errorMessage: ''
}
export default function loginReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler
    ? handler(state, action)
    : state
}

/* @flow*/

import {fileObject} from '../interfaces/files.js'

// ------------------------------------
// Constants
// ------------------------------------
export const UPLOAD_REQUEST = 'UPLOAD_REQUEST'
export const UPLOAD_PUSH = 'UPLOAD_PUSH'
export const UPLOAD_SAVE = 'UPLOAD_SAVE'

// ------------------------------------
// Actions
// ------------------------------------

export function uploadRequest () {
  return {
    type: UPLOAD_REQUEST
  }
}

export function uploadFile (value: fileObject) {
  return {
    type: UPLOAD_PUSH
  }
}

export function uploadSave () {
  return {
    type: UPLOAD_SAVE
  }
}

export function increment (value = 1) {
  return {
    type: UPLOAD_REQUEST,
    payload: value
  }
}

/*  This is a thunk, meaning it is a function that immediately
    returns a function for lazy evaluation. It is incredibly useful for
    creating async actions, especially when combined with redux-thunk!

    NOTE: This is solely for demonstration purposes. In a real application,
    you'd probably want to dispatch an action of COUNTER_DOUBLE and let the
    reducer take care of this logic.  */

export const doubleAsync = () => {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        dispatch(increment(getState().counter))
        resolve()
      }, 200)
    })
  }
}

export const actions = {
  increment,
  doubleAsync
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [UPLOAD_REQUEST]: (state, action) => state + action.payload,
  [UPLOAD_PUSH]: (state, action) => state,
  [UPLOAD_SAVE]: (state, action) => state
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {}
export default function uploadFileReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

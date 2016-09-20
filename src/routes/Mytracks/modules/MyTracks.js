/* @flow*/

import { trackObject, tracksObject } from '../interfaces/track.js'
import testJSON from '../testdata.js'

// ------------------------------------
// Constants
// ------------------------------------
export const TRACKS_REQUEST = 'TRACKS_REQUEST'
export const TRACKS_SUCCESS = 'TRACKS_SUCCESS'
export const TRACKS_FAILURE = 'TRACKS_FAILURE'

// ------------------------------------
// Actions
// ------------------------------------

export function requestTracks(userId: string) {
  return {
    type: TRACKS_REQUEST,
    userId: userId
  }
}

export function errorTracks (message: string) {
  return {
    type: TRACKS_FAILURE,
    errorMessage: message
  }
}


const addKey = (tracks: tracksObject): tracksObject => {
  return tracks.map((i) => Object.assign({}, i, { key: i.id, songId: i.id }))
}

export function successTracks (tracks: tracksObject) {
  console.log('successtracks - addingkeyshown for fun')
  console.log(addKey(tracks))
  return {
    type: TRACKS_SUCCESS,
    tracks: tracks
  }
}

export const fetchTracks = (userId: string): tracksObject => {
  // testdata
  return (dispatch) => {
    Promise.resolve(
      dispatch(requestTracks(userId))
    )
      .then(() => {
        dispatch(successTracks(JSON.parse(testJSON).songs))
      })
  }
}

export const loadTracks = (userId: string): tracksObject => {
  // TODO: caching and pagination
  return (dispatch, getState) => {
    console.log(getState())
    if (getState().MyTracks.tracks && (getState().MyTracks.tracks.length > 0)) {
      return dispatch(errorTracks('Still no caching... sorry pal'))
    }
    return dispatch(fetchTracks(userId))
  }
}

export const actions = {
  loadTracks
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [TRACKS_REQUEST]: (state, action) => Object.assign({}, state,
    { isFetching: true }),
  [TRACKS_FAILURE]: (state, action) => Object.assign({}, state,
    { isFetching: false }),
  [TRACKS_SUCCESS]: (state, action) => Object.assign({}, state,
    { isFetching: false, tracks: action.tracks })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isFetching: true,
  isAuthenticated: localStorage.getItem('playblu_token') ? true : false,
  user: { userId: '', email: '', firstname: '', lastname: '', username: '' },
  tracks: [],
  errorMessage: ''
}
export default function MyTracksReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

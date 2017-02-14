import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import {LOGIN_SUCCESS, LOGOUT_SUCCESS} from '../routes/Login/modules/loginUser.js'

// sniff for some global variables settings
const globalReducer = (state = {}, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return ({ ...state, isAuthenticated: true })
    case LOGOUT_SUCCESS:
      return ({ ...state, isAuthenticated: false })
    case 'ITEMS_DONE':
      return ({ ...state, errorMessage: 'no errors' })
    default:
      return ({ ...state })
  }
}


export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // Add sync reducers here
    form: formReducer,
    globalReducer,
    router,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer

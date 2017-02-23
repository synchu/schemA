import CoreLayout from '../layouts/CoreLayout/CoreLayout'
import Home from './Home'
import uploadFileRoute from './UploadFile'
import LoginRoute from './Login'
import {LOGIN_SUCCESS, LOGIN_FAILURE} from './Login/modules/loginUser'
import {SET_AUTH_ON, SET_AUTH_OFF} from './Home/modules/Home'

// import DownloadFileRoute from './DownloadFile'

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

import {injectReducer} from '../store/reducers'

export const homeReducer = (store) => {
  const reducer = require('./Home/modules/Home').default
  /*  Add the reducer to the store on key  */
  injectReducer(store, {
    key: 'Home',
    reducer
  })
}

export const createRoutes = (store, auth) => {
  // const auth = new AuthService(__AUTH0_CLIENT_ID__, __AUTH0_DOMAIN__, () =>
  // ('return'))

  const authRequired = (nextState, replace) => {
    // Now you can access the store object here.
    const auth = store
      .getState()
      .globalReducer
      .auth

    if (auth) {
      if (auth.loggedIn()) {
        store.dispatch({type: LOGIN_SUCCESS})
        store.dispatch({type: SET_AUTH_ON})
        
      }

      if (!auth.loggedIn() && nextState.location.pathname === '/login') {
        auth.login()
        // replace('/') replace({ nextPathname: nextState.location.pathname }, '/')
      } else if (auth.loggedIn() && nextState.location.pathname === '/login') {
        store.dispatch({type: LOGIN_SUCCESS})
        store.dispatch({type: SET_AUTH_ON})
        replace('/')
      } else if (!auth.loggedIn() && nextState.location.pathname === '/') {
        store.dispatch({type: LOGIN_FAILURE})
        store.dispatch({type: SET_AUTH_OFF})
      }
    }
  }

  homeReducer(store)

  return {
    path: '/',
    component: CoreLayout,
    indexRoute: Home,
    onEnter: authRequired,
    childRoutes: [
      uploadFileRoute(store), LoginRoute(store)
      //  SignUpRoute(store)
    ]
  }
}

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes

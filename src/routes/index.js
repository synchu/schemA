// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout/CoreLayout'
import Home from './Home'
import uploadFileRoute from './UploadFile'
import LoginRoute from './Login'
import AuthService from 'utils/AuthService.js'
import {__AUTH0_CLIENT_ID__, __AUTH0_DOMAIN__} from 'authid'

// import DownloadFileRoute from './DownloadFile'

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

import {injectReducer} from '../store/reducers'

const auth = new AuthService(__AUTH0_CLIENT_ID__, __AUTH0_DOMAIN__)

export const homeReducer = (store) => {
  const reducer = require('./Home/modules/Home').default
  /*  Add the reducer to the store on key  */
  injectReducer(store, {
    key: 'Home',
    reducer
  })
}

export const createRoutes = (store) => {
  const authRequired = (nextState, replace) => {
    // Now you can access the store object here.
    const state = store.getState()
    const schemarchToken = localStorage.getItem('schemarch_token')
    if (!auth.loggedIn()) {
      auth.login()
    } else {}
    if (state.globalReducer && !state.globalReducer.isAuthenticated) {
      console.log('not yet authenticated')
      // replace({ nextPathname: nextState.location.pathname }, '/login')
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

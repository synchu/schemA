import React from 'react'
import ReactDOM from 'react-dom'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import {useRouterHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import createStore from './store/createStore'
import AppContainer from './containers/AppContainer'
import AuthService from 'utils/AuthService.js'
import {__AUTH0_CLIENT_ID__, __AUTH0_DOMAIN__} from './routes/authid'
import {LOGIN_SUCCESS} from './routes/Login/modules/loginUser'
import {SET_AUTH_ON} from './routes/Home/modules/Home'

// ======================================================== Browser History
// Setup ========================================================
const browserHistory = useRouterHistory(createBrowserHistory)({basename: __BASENAME__})

// ======================================================== Store and History
// Instantiation ======================================================== Create
// redux store and sync with react-router-redux. We have installed the
// react-router-redux reducer under the routerKey "router" in
// src/routes/index.js, so we need to provide a custom `selectLocationState` to
// inform react-router-redux of its location.
const initialState = window.___INITIAL_STATE__
const store = createStore(initialState, browserHistory)
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: (state) => state.router
})

const auth = new AuthService(__AUTH0_CLIENT_ID__, __AUTH0_DOMAIN__, () => {
  store.dispatch({type: LOGIN_SUCCESS})
  store.dispatch({type: SET_AUTH_ON})
})

// ======================================================== Developer Tools
// Setup ========================================================
if (__DEBUG__) {
  if (window.devToolsExtension) {
    // window.devToolsExtension.open()
  }
}

// ======================================================== Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root')

let render = (routerKey = null) => {
  const routes = require('./routes/index').default(store, auth)

  ReactDOM.render(
    <AppContainer
      store={store}
      history={history}
      routes={routes}
      routerKey={routerKey}
      auth={auth} />, MOUNT_NODE)
}

// Enable HMR and catch runtime errors in RedBox This code is excluded from
// production bundle
if (__DEV__ && module.hot) {
  const renderApp = render
  const renderError = (error) => {
    const RedBox = require('redbox-react').default

    ReactDOM.render(
      <RedBox error={error} />, MOUNT_NODE)
  }
  render = () => {
    try {
      renderApp(Math.random())
    } catch (error) {
      renderError(error)
    }
  }
  module
    .hot
    .accept(['./routes/index'], () => render())
}

// ======================================================== Go!
// ========================================================
render()

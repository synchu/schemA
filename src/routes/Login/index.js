import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'login',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const LoginContainer = require('./containers/LoginContainer').default
      const reducer = require('./modules/loginUser').default

      /*  Add the reducer to the store on key  */
      injectReducer(store, { key: 'loginUser', reducer })
     /*  Return getComponent   */
      cb(null, LoginContainer)

    /* Webpack named bundle   */
    }, 'loginUser')
  }
})

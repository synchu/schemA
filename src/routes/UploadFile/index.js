import {injectReducer} from '../../store/reducers'

export default(store) => ({
  path: 'upload',

  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const uploadFile = require('./containers/uploadFileContainer').default
      const reducer = require('./modules/uploadFile').default

      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, {
        key: 'uploadFile',
        reducer
      })
      // not authenticated - return nothing
      if (!store.getState().globalReducer.auth || !store.getState().globalReducer.auth.loggedIn()) {
        return (
          null
        )
      }
      /*  Return getComponent   */
      cb(null, uploadFile)

      /* Webpack named bundle   */
    }, 'uploadFile')
  }
})

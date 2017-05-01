import PropTypes from 'prop-types';
import React from 'react';
import { Router } from 'react-router'
import { Provider } from 'react-redux'

class AppContainer extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired,
    routerKey: PropTypes.number,
    store: PropTypes.object.isRequired,
    auth: PropTypes.object
  }

  componentDidMount = () => {
    const {store, auth} = this.props
    store.dispatch({type: 'SET_AUTH', auth: auth})
  }

  render () {
    const { history, routes, routerKey, store, auth } = this.props

    return (
      <Provider store={store}>
        <div style={{ height: '100%' }}>
          <Router history={history} children={routes} key={routerKey} auth={auth} />
        </div>
      </Provider>
    )
  }
}

export default AppContainer

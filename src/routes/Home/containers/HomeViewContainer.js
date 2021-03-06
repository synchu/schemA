/* @flow*/
import {connect} from 'react-redux'
import {
  loadBrands,
  loadModels,
  selectBrand,
  filterBrand,
  loadAmpsVersions,
  filterModels,
  selectModel,
  loadItem,
  setNavbarActive,
  setNavbarPinned,
  toggleSearching,
  setAuthOnOff,
  observableFetch
} from '../modules/Home'
import {logoutUser, loginUser, requestLogin} from '../../Login/modules/loginUser'
// import { userObject } from '../interfaces/user'

/*  This is a container component. Notice it does not contain any JSX,
    nor does it import React. This component is **only** responsible for
    wiring in the actions and state necessary to render a presentational
    component - in this case, the counter:   */

import HomeView from '../components/HomeView'

/*  Object of action creators (can also be function that returns object).
    Keys will be passed as props to presentational components. Here we are
    implementing our wrapper around increment; the component doesn't care   */

const mapActionCreators = {
  loadBrands,
  loadModels,
  selectBrand,
  filterBrand,
  filterModels,
  selectModel,
  loadItem,
  setNavbarActive,
  setNavbarPinned,
  loadAmpsVersions,
  observableFetch,
  toggleSearching,
  setAuthOnOff,
  loginUser,
  logoutUser,
  requestLogin
}

const getMessage = (state) => {
  return state.errorMessage
}

const getRoles = (state) => {
  const auth = state.globalReducer.auth
  if (auth) {
    return auth.getProfile(auth.getToken()).roles
  } else {
    return []
  }
}

const getName = (state) => {
  const auth = state.globalReducer.auth
  if (auth) {
    return auth.getProfile(auth.getToken()).name
  } else {
    return ''
  }
}

const getPicture = (state) => {
  const auth = state.globalReducer.auth
  if (auth) {
    return auth.getProfile(auth.getToken()).picture
  } else {
    return ''
  }
}

const mapStateToProps = (state) => ({
  errorMessage: getMessage(state),
  brands: state.Home.brands,
  isFetching: state.Home.isFetching,
  snackMessage: getMessage(state),
  models: state.Home.models,
  selectedBrand: state.Home.selectedBrand,
  filteredBrand: state.Home.filteredBrand,
  filteredModels: state.Home.filteredModels,
  selectedModel: state.Home.selectedModel,
  item: state.Home.item,
  selectedModelsList: state.Home.selectedModelsList,
  navbarPinned: state.Home.navbarPinned,
  navbarActive: state.Home.navbarActive,
  ampVersions: state.Home.ampVersions,
  isFetchingModels: state.Home.isFetchingModels,
  searching: state.Home.searching,
  isAuthenticated: state.Home.isAuthenticated,
  auth: state.globalReducer.auth,
  roles: getRoles(state),
  picture: getPicture(state),
  username: getName(state)
})

/*  Note: mapStateToProps is where you should use `reselect` to create selectors, ie:

    import { createSelector } from 'reselect'
    const counter = (state) => state.counter
    const tripleCount = createSelector(counter, (count) => count * 3)
    const mapStateToProps = (state) => ({
      counter: tripleCount(state)
    })

    Selectors can compute derived data, allowing Redux to store the minimal possible state.
    Selectors are efficient. A selector is not recomputed unless one of its arguments change.
    Selectors are composable. They can be used as input to other selectors.
    https://github.com/reactjs/reselect    */

export default connect(mapStateToProps, mapActionCreators)(HomeView)

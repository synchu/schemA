/* @flow*/
import { connect } from 'react-redux'
import { receiveLogin, requestLogin, loginError, validateEmail,
         successValidateEmail, emailError, successValidatePassword,
         passwordError, updateEmail } from '../modules/loginUser'
import { userObject } from '../interfaces/user'

/*  This is a container component. Notice it does not contain any JSX,
    nor does it import React. This component is **only** responsible for
    wiring in the actions and state necessary to render a presentational
    component - in this case, the counter:   */

import LoginView from '../components/LoginView'

/*  Object of action creators (can also be function that returns object).
    Keys will be passed as props to presentational components. Here we are
    implementing our wrapper around increment; the component doesn't care   */

const mapActionCreators = {
  requestLogin,
  receiveLogin,
  loginError,
  successValidateEmail,
  successValidatePassword,
  emailError,
  passwordError,
  validateEmail,
  updateEmail
}

const mapStateToProps = (state) => ({
  user: state.loginUser.user,
  creds: state.loginUser.creds,
  errorMessage: state.loginUser.errorMessage,
  isAuthenticated: state.loginUser.isAuthenticated,
  isFetching: state.loginUser.isFetching,
  playblu_token: state.loginUser.playblu_token,
  emailValid: state.loginUser.emailValid,
  passwordValid: state.loginUser.passwordValid,
  userEmail: state.loginUser.userEmail,
  userPassword: state.loginUser.userPassword
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

export default connect(mapStateToProps, mapActionCreators)(LoginView)

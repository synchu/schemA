/* @flow*/
import { connect } from 'react-redux'
import { receiveLogin, requestLogin, loginError, validateEmail,
         successValidateEmail, emailError, successValidatePassword,
         passwordError, updateEmail, verifyUsername,
        handleAcceptTermsChange } from '../modules/SignUpUser'
// import { userObject } from '../interfaces/user'

/*  This is a container component. Notice it does not contain any JSX,
    nor does it import React. This component is **only** responsible for
    wiring in the actions and state necessary to render a presentational
    component - in this case, the counter:   */

import SignUpView from '../components/SignUpView'

/*  Object of action creators (can also be function that returns object).
    Keys will be passed as props to presentational components. Here we are
    implementing our wrapper around increment; the component doesn't care   */

/*
const mapActionCreators = {
  requestLogin: () => requestLogin(this.props.creds),
  receiveLogin: () => receiveLogin(this.props.user),
  loginError: () => loginError(this.props.errorMessage),
  localValidateEmail: (email) => localValidateEmail(email)
}
*/

const mapActionCreators = {
  requestLogin,
  receiveLogin,
  loginError,
  successValidateEmail,
  successValidatePassword,
  emailError,
  passwordError,
  validateEmail,
  updateEmail,
  verifyUsername,
  handleAcceptTermsChange
}

const mapStateToProps = (state) => ({
  errorMessage: state.SignUpUser.errorMessage,
  isAuthenticated: state.SignUpUser.isAuthenticated,
  isFetching: state.SignUpUser.isFetching,
  emailValid: state.SignUpUser.emailValid,
  passwordValid: state.SignUpUser.passwordValid,
  userEmail: state.SignUpUser.userEmail,
  userPassword: state.SignUpUser.userPassword,
  isUsernameTaken: state.SignUpUser.isUsernameTaken,
  acceptterms: state.SignUpUser.acceptterms
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

export default connect(mapStateToProps, mapActionCreators)(SignUpView)

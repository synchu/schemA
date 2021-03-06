import {EventEmitter} from 'events'
import {isTokenExpired} from './jwtHelper'
import Auth0Lock from 'auth0-lock'
import {browserHistory} from 'react-router'

export default class AuthService extends EventEmitter {

  constructor(clientId, domain, onAuth) {
    super()
    // Configure Auth0
    this.lock = new Auth0Lock(clientId, domain, {
      additionalSignUpFields: [{name: 'name', placeholder: 'Fill in your name'},
      {name: 'source', placeholder: 'How did you find SchemA?'},
      {name: 'icon_custom', placeholder: 'Enter picture URL'}
      ],
      auth: {
        redirectUrl: `${window.location.origin}/`,
        responseType: 'token'
      },
      theme: {
        logo: ''
      },
      languageDictionary: {
        title: 'SchemA login'
      }
    })
    // Add callback for lock `authenticated` event
    this
      .lock
      .on('authenticated', this._doAuthentication.bind(this))
    // Add callback for lock `authorization_error` event
    this
      .lock
      .on('authorization_error', this._authorizationError.bind(this))
    // binds login functions to keep this context
    this.login = this
      .login
      .bind(this)
    this
      ._onAuth = onAuth.bind(this)
  }

  _doAuthentication(authResult) {
    // Saves the user token
    this.setToken(authResult.idToken)
    // navigate to the home route
    browserHistory.replace('/')

    if (this._onAuth) {
      this._onAuth()
    }
    // Async loads the user profile data
    this
      .lock
      .getProfile(authResult.idToken, (error, profile) => {
        if (error) {
          console.log('Error loading the Profile', error)
        } else {
          this.setProfile(profile)
          // fire if everything is ok
        }
      })
  }

  _authorizationError(error) {
    // Unexpected authentication error
    console.log('Authentication Error', error)
    browserHistory.replace('/')
  }

  login() {
    // Call the show method to display the widget.
    this
      .lock
      .show()
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken()
    return !!token && !isTokenExpired(token)
  }

  setProfile(profile) {
    // Saves profile data to localStorage
    localStorage.setItem('profile', JSON.stringify(profile))
    // Triggers profile_updated event to update the UI
    this.emit('profile_updated', profile)
  }

  getProfile() {
    // Retrieves the profile data from localStorage
    const profile = localStorage.getItem('profile')
    return profile
      ? JSON.parse(localStorage.profile)
      : {}
  }

  setToken(idToken) {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken)
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token')
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token')
    localStorage.removeItem('profile')
  }
}

import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'react-toolbox'
import { Card, CardTitle, CardActions } from 'react-toolbox/lib/card'
import Input from 'react-toolbox/lib/input'
import { Field, reduxForm } from 'redux-form'
import { push } from 'react-router-redux'
import { validatePassword } from '../../../utils/validators'
import { localStorageExists } from '../../../utils/localstorage'
import { successValidateEmail, successValidatePassword, receiveLogin } from '../modules/loginUser'

import classes from './LoginView.scss'

const validate = values => {
  const errors = {}
  if (!values.username) {
    errors.username = 'Required'
  } else if (values.username.length > 15) {
    errors.username = 'Must be 15 characters or less'
  }
  if (!values.email) {
    errors.email = 'Required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }
  if (!values.password) {
    errors.password = 'Required'
  } else {
    errors.password = validatePassword(values.password)
  }
  return errors
}

export const renderField = ({ input, label, type, icon, meta: { touched, error } }) => (
  <div>
    <Input {...input} label={label} type={type} icon={icon} error={touched ? error : ''} />
  </div>
)

renderField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
  icon: PropTypes.any
}

const localHandleSubmit = (e, props) => {
  props.dispatch(successValidateEmail(e.email))
  props.dispatch(successValidatePassword(e.password))
  if (localStorageExists()) {
    localStorage.setItem('playblu_token', e.email)
  }
  props.dispatch(receiveLogin({playblu_token: e.email}))
  props.dispatch(push('/mytracks'))
}

export const LoginView = (props) => {
  const { handleSubmit, pristine, reset, submitting } = props
  console.log('Yep. In God we trust, all others must submit an X.509 Certificate')
  return (
    <span> Logging in...</span>
   /* <form onSubmit={handleSubmit(data => (localHandleSubmit(data, props)))}>
      <div>
        <Card className={classes['logincard']} raised >
          <CardTitle title='Login' theme={classes} />
          <Field name='email' component={renderField}
            type='email'
            label='Email address' required
            icon='email' />
          <span className={classes.msg}>
            or
          </span>
          <Field name='username' component={renderField}
            type='text'
            label='User name' required
            icon={<span>H</span>} />
          <Field name='password' component={renderField}
            type='password'
            label='Password' required
            icon='lock'
            />
          <CardActions className={classes['actions']}>
            <Button type='submit' label='Login' raised default disabled={submitting} />
            <Button type='button' label='Cancel' disabled={pristine || submitting} onClick={reset} />
          </CardActions>
        </Card>
      </div>
    </form>*/
  )
}

LoginView.propTypes = {
  validateEmail: PropTypes.func.isRequired,
  dispatch: PropTypes.func,
  errorMessage: PropTypes.string,
  isAuthenticated: PropTypes.bool,
  emailValid: PropTypes.bool,
  message: PropTypes.string,
  user: PropTypes.object,
  username: PropTypes.string,
  password: PropTypes.string,
  userEmail: PropTypes.string,
  fields: PropTypes.array,
  handleSubmit: PropTypes.func,
  reset: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool
}

export default reduxForm({
  form: 'LoginView',  // a unique identifier for this form
  initialValues: { username: 'synchu', password: 'dryndryn', email: 'mwproj@mail.bg' },
  validate
})(LoginView)

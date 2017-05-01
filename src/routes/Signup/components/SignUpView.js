import PropTypes from 'prop-types';
import React from 'react';
import { Button, Link, Checkbox, Navigation } from 'react-toolbox'
import { Card, CardTitle, CardActions } from 'react-toolbox/lib/card'
import Input from 'react-toolbox/lib/input'
import { Field, reduxForm } from 'redux-form'
import { push } from 'react-router-redux'
import { validatePassword, checkUsernameTaken } from '../../../utils/validators'
import { successValidateEmail, successValidatePassword, verifyUsername } from '../modules/SignUpUser'

import classes from './SignUpView.scss'

const validate = values => {
  const errors = {}
  if (!values.username) {
    errors.username = 'Required'
  } else if (values.username.length > 15) {
    errors.username = 'Must be 15 characters or less'
  } else if (checkUsernameTaken(values.username)) {
    errors.username = 'Username already taken'
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
  if (!values.acceptterms) {
    errors.acceptterms = 'Required'
  } else if (!values.acceptterms) {
    errors.acceptterms = 'You must accept terms of use prior to use Playblu!'
  }
  return errors
}

export const renderField = ({ input, label, type, icon, meta: { touched, error } }) => (
  <div>
    <Input {...input} label={label} type={type} icon={icon} error={touched ? error : ''} />
  </div>
)

export const checkField = ({ input, label }) => (
  <Checkbox {...input} label={label} checked={input.value ? true : false} href="#/components/link" />
)

renderField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
  icon: PropTypes.any
}

checkField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  checked: PropTypes.bool
}

const localHandleSubmit = (e, props) => {
  props.dispatch(verifyUsername(e.username))
  props.dispatch(successValidateEmail(e.email))
  props.dispatch(successValidatePassword(e.password))
  localStorage.setItem('playblu_token', e.email, e.password)
  props.dispatch(push('/counter'))
}

const handleAcceptTermsChange = (e, props) => {
  props.dispatch(handleAcceptTermsChange(e.value))
}

export const SignUpView = (props) => {
  const { handleSubmit, pristine, reset, submitting, acceptterms } = props

  return (
    <form onSubmit={handleSubmit(data => (localHandleSubmit(data, props)))}>
      <div>
        <Card className={classes['signupcard']} raised >
          <CardTitle title='Sign up for Playblu' theme={classes} />
          <Field name='email' component={renderField}
            type='email'
            label='Email address' required
            icon='email' />
          <Field name='username' component={renderField}
            type='text'
            label='User name' required
            icon='person' />
          <Field name='password' component={renderField}
            type='password'
            label='Password' required
            icon='lock'
            />
          <Field name='firstname' component={renderField}
            type='text'
            label='First name'
            icon={<span>U</span>}
            />
          <Field name='familyname' component={renderField}
            type='text'
            label='Family name'
            icon={<span>F</span>}
           />

          <Navigation type='horizontal'>
            <Link>
              <Field name='acceptterms' component={checkField}
                onChange={(e) => (handleAcceptTermsChange(e, props))}
                checked={acceptterms}
                type='text'
                label='' required
              />
            </Link>
            <Link href="#/components/link" target='_blank'
              label='Read & accept terms of use' className={classes['acceptbox']} />
          </Navigation>

          <CardActions className={classes['actions']}>
            <Button type='submit' label='Sign up' raised default disabled={submitting} />
            <Button type='button' label='Cancel' disabled={pristine || submitting} onClick={reset} />
          </CardActions>
        </Card>
      </div>
    </form>
  )
}

SignUpView.propTypes = {
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
  submitting: PropTypes.bool,
  acceptterms: PropTypes.bool
}

export default reduxForm({
  form: 'SignUpView',  // a unique identifier for this form
  initialValues: { username: '', password: '', email: '' },
  validate
})(SignUpView)

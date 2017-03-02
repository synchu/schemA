import React, { PropTypes, Component } from 'react'
import { Button, Table, Card, CardTitle, CardActions, Autocomplete, IconButton } from 'react-toolbox'
import Input from 'react-toolbox/lib/input'
import { Field, reduxForm } from 'redux-form/immutable'
import { validatePassword } from '../../../utils/validators'
import { AmpModel } from '../modules/filesTableData'
import { validators } from '../modules/validateData'

import classes from './UploadItem.scss'

const validate = values => {
  console.log('submit validate: ', values)
  const errors = {}
  if (!values.username) {
    errors.username = 'Required'
  } else if (values.username.length > 15) {
    errors.username = 'Must be 15 characters or less'
  }
  if (!values.password) {
    errors.password = 'Required'
  } else {
    errors.password = validatePassword(values.password)
  }
  return errors
}

export class UploadItem extends Component {

  static propTypes = {
    validateEmail: React.PropTypes.func,
    dispatch: React.PropTypes.func,
    errorMessage: React.PropTypes.string,
    isAuthenticated: React.PropTypes.bool,
    emailValid: React.PropTypes.bool,
    message: React.PropTypes.string,
    user: React.PropTypes.object,
    username: React.PropTypes.string,
    password: React.PropTypes.string,
    fields: React.PropTypes.array,
    handleSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    reset: PropTypes.func,
    submitting: PropTypes.bool,
    files: PropTypes.array,
    description: PropTypes.string,
    loadBrandsDropdown: PropTypes.func,
    ampVersions: PropTypes.any,
    amps: PropTypes.any,
    brand: PropTypes.string,
    model: PropTypes.string,
    version: PropTypes.string,
    setBrand: PropTypes.func,
    setModel: PropTypes.func,
    rawdata: PropTypes.array,
    models: PropTypes.object,
    versions: PropTypes.object,
    setVersion: PropTypes.func,
    filesData: PropTypes.array,
    change: PropTypes.func,
    setFilesData: PropTypes.func,
    addNewTableRow: PropTypes.func
  }

  constructor (props) {
    super(props)
  }

  componentDidMount = () => {
    this.props.loadBrandsDropdown()
  }

  renderField = ({ input, label, type, icon, meta: { touched, error, warning }, ...custom }) => {
    return (
      <div>
        <Input {...input} label={label} type={type}
          icon={icon} error={touched ? error : ''} style={{ width: '80%' }} {...custom} />
        {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
      </div>
    )
  }

  renderAutocompleteField = ({ input, label, type, icon, required, source, theme, disabled,
     meta: { touched, error, warning }, children, ...custom }) => {
    return (
      <div>
        <Autocomplete {...input} required disabled={disabled}
          label={label} type={type} source={source}
          multiple={false} icon={icon}
          error={touched ? error : ''} style={{ width: '80%' }}
          onChange={
          (value, index) => {
            return input.onChange(value)
          }
        }
          children={children}
          suggestionMatch='anywhere'
          theme={classes}
          value={input.value}
          key={input.name}
        />
        {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
      </div>
    )
  }

  localHandleSubmit = (e, props) => {
    console.log('localHandleSubmit', props)
    return false
  // props.dispatch(successValidateEmail(e.email))
  // props.dispatch(successValidatePassword(e.password))
  // props.dispatch(receiveLogin({playblu_token: e.email}))
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    return true
  }

  handleChange = (value) => {
    const {brand, setBrand, change} = this.props
    setBrand(brand, change)
  }

  handleModelChange = (value) => {
    const {model, setModel, change} = this.props
    setModel(model, change)
  }

  handleVersionChange = (value) => {
    const {version, setVersion, change} = this.props
    setVersion(version, change)
  }

  handleTableChange = (row, key, value) => {
    const { setFilesData } = this.props
    setFilesData(row, key, value)
  }

  handleAddTableRow = () => {
    const { addNewTableRow } = this.props
    addNewTableRow()
  }

  render () {
    const { handleSubmit, pristine, reset,
    submitting, amps, models, versions} = this.props
    return (
    <form onSubmit={handleSubmit(data => (this.localHandleSubmit(data, this.props)))} className={classes.container} >
      <div>
        <Card className={classes['ampitemcard']} raised >
          <CardTitle title='Edit/Create amp item' theme={classes} />
          <span style={{ display: 'flex', flexFlow: 'row wrap' }}>
            <Field name='brand' label='Brand'
              component={this.renderAutocompleteField}
              required
              type='search'
              hint='Type to choose brand...'
              direction='down'
              icon='search'
              className={classes.searchInput}
              source={amps}
              onBlur={this.handleChange}
              warn={validators.minLength2}
              />
            <Field name='model' label='Model'
              component={this.renderAutocompleteField}
              required
              type='search'
              hint='Type to choose model...'
              direction='down'
              icon='search'
              className={classes.searchInput}
              source={
                models
              }
              onBlur={this.handleModelChange}
              />
            <Field name='version' label='Version'
              component={this.renderAutocompleteField}
              required
              type='search'
              hint='Type to choose version...'
              direction='down'
              icon='search'
              className={classes.searchInput}
              source={
                versions
              }
              onBlur={this.handleVersionChange}
              />
          </span>
          <Field name='description' component={this.renderField}
            type='text'
            label='Description' required
            icon='description'
            multiline />
          <Field name='contributor' component={this.renderField}
            type='text'
            label='Contributor' required
            icon='control_point'
            />
          <IconButton icon='playlist_add' title='Add file item' onClick={this.handleAddTableRow} style={{marginLeft: 'auto'}} />
          <Table model={AmpModel}
            selectable
            multiSelectable
            source={this.props.filesData}
            onChange={this.handleTableChange}
            />
          <CardActions className={classes['actions']}>
            <Button type='submit' label='Upload' raised default disabled={submitting} />
            <Button type='button' label='Cancel' disabled={pristine || submitting} onClick={reset} />
          </CardActions>
        </Card>
      </div>
    </form>
    )
  }
}

export default reduxForm({
  form: 'UploadItem',  // a unique identifier for this form
  initialValues: { description: '', contributor: '', files: '', brand: '', model: '', version: '' },
  validate
})(UploadItem)

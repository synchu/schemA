import React, { PropTypes, Component } from 'react'
import { Button, Table, Card, CardTitle, CardActions, Autocomplete } from 'react-toolbox'
import Input from 'react-toolbox/lib/input'
import { Field, reduxForm } from 'redux-form'
import _ from 'lodash'
import { validatePassword } from '../../../utils/validators'
import { localStorageExists } from '../../../utils/localstorage'
import FileDropzone from './Dropzone'

import classes from './UploadItem.scss'



const AmpModel = {
  id: { type: Number },
  data_id: { type: Number },
  brand: { type: String },
  model: { type: String },
  version: { type: String },
  type: { type: String },
  data: { type: String },
  name: { type: String },
  file: { type: Object }
}

const users = [
  {
    id: 1, data_id: 1, brand: 'Fender', model: 'Bassman', version: '5B6', type: 'schematic',
    data: <Field component={FileDropzone}
      label='Click or drag to upload file'
      icon='file'
      type='file'
      name='files'
      multiple
      table
      rkey={1} />
  },
  {
    id: 1, data_id: 2, brand: 'Fender', model: 'Bassman', version: '5B6', type: 'schematic',
    data: <Field component={FileDropzone}
      label="Click or drag to upload file"
      icon='file'
      type='file'
      name='files'
      multiple
      table
      rkey={2} />
  }
]

const validate = values => {
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

  state = {}
  static modelSource = {}
  static versionSource = {}

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
    amps: PropTypes.any
  }
  constructor(props) {
    super(props)
    this.renderField = this.renderField.bind(this)
    this.renderAutocompleteField = this.renderAutocompleteField.bind(this)
  }

  componentDidMount() {
    this.props.loadBrandsDropdown()
  }

  renderField = ({ input, label, type, icon, meta: { touched, error } }) => (
    <div>
      <Input {...input} label={label} type={type} icon={icon} error={touched ? error : ''} style={{ width: '80%' }} />
    </div>
  )

  renderAutocompleteField = ({ input, label, type, icon, required, source, onChange, theme, disabled, meta: { touched, error }, ...custom }) => {
  return (
    <div>
      <Autocomplete {...input} required disabled={disabled}
        label={label} type={type} source={source}
        multiple={false} icon={icon}
        error={touched ? error : ''} style={{ width: '80%' }}
        onChange={
          (e) => {
            input.onChange(e)
          }
        }
        suggestionMatch='anywhere'
        theme={classes}
        value={input.value}
        key={input.name}
        />
    </div>
  )
}


localHandleSubmit = (e, props) => {
  // props.dispatch(successValidateEmail(e.email))
  //  props.dispatch(successValidatePassword(e.password))
  if (localStorageExists()) {
    localStorage.setItem('playblu_token', e.email)
  }
  //  props.dispatch(receiveLogin({playblu_token: e.email}))
}

handleMultipleChange = (field) => (value) => {
  const { ampVersions, amps, loadModels, selectBrand, selectModel } = this.props

  let selected = ampVersions[value].split(' ')

  /* selectBrand(selected[2])
  loadModels()
  selectModel(selected[1])
  loadItem() */
}

shouldComponentUpdate = (nextProps, nextState) => {
  return true
}

componentWillReceiveProps = (nextProps: Object) => {
  const {rawdata, amps, brand, model} = nextProps
  if (this.props.brand !== nextProps.brand) {
    let c = {}
    this.modelSource = {}
    _.uniqBy(rawdata.filter((i) => i[2] === amps[brand]), '1').map(a => {
      c = Object.defineProperty(c, a[1], {
        enumerable: true,
        configurable: false,
        writable: false,
        value: a[1]
      })
    })
    this.modelSource = Object.assign({}, c)
  }
  if (this.props.model !== nextProps.model) {
    let c = {}
    this.versionSource = {}
    _.uniqBy(rawdata.filter((i) => i[1] === model), '0').map(a => {
      c = Object.defineProperty(c, a[0], {
        enumerable: true,
        configurable: false,
        writable: false,
        value: a[0]
      })
    })
    this.versionSource = Object.assign({}, c)
    console.log(this.versionSource)
  }
}

render() {
  const { handleSubmit, pristine, reset,
    submitting, amps} = this.props

  console.log('Yep. In God we trust, all others must submit X.509 Certificate')

  return (
    <form onSubmit={handleSubmit(data => (this.localHandleSubmit(data, this.props)))} className={classes.container} >
      <div>
        <Card className={classes['ampitemcard']} raised >
          <CardTitle title='Upload amp item' theme={classes} />
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
                this.modelSource
              }
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
                this.versionSource
              }
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
          <Table model={AmpModel}
            selectable
            multiSelectable
            source={users}
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

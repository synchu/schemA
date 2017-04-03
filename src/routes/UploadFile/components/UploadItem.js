import React, { PropTypes, Component } from 'react'
import { Button, Table, Card, CardTitle, AppBar,
  CardActions, Autocomplete, IconButton,
 TableHead, TableRow, TableCell, ProgressBar} from 'react-toolbox'
import {IndexLink} from 'react-router'
import Input from 'react-toolbox/lib/input'
import { Field, reduxForm, FieldArray, formValueSelector } from 'redux-form/immutable'
import { validatePassword } from '../../../utils/validators'
import { TypeSelector } from '../components/TypeSelector'
import { FileDropzone } from '../components/Dropzone'
import Logo from '../../../components/Logo'
import { validators } from '../modules/validateData'
import { checkAmpItemExists } from '../modules/filesTableData'

import classes from './UploadItem.scss'

const validate = values => {
  // console.log('submit validate: ', values)
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


const renderField = ({ input, label, type, icon, meta: { touched, error, warning }, ...custom }) => {
  return (
      <div>
        <Input {...input} label={label} type={type}
          icon={icon} error={touched ? error : ''} style={{ width: '80%' }} {...custom} />
        {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
      </div>
  )
}

renderField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  icon: PropTypes.string,
  meta: PropTypes.object
}

const renderAutocompleteField = ({ input, label, type, icon, required, source, theme, disabled,
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

renderAutocompleteField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  icon: PropTypes.string,
  source: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  theme: PropTypes.object,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.element,
  meta: PropTypes.object
}

const renderInputTableCell = ({ input, label, icon, meta: { touched, error, warning }, ...custom }) => {
  return (
    <TableCell>
      <Input {...input} label={label} icon={icon} error={touched ? error : ''} style={{ width: '80%' }}
        className={custom.className}
        multiline={custom.multiline}
        />
        {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
    </TableCell>
  )
}

renderInputTableCell.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  icon: PropTypes.string,
  meta: PropTypes.object
}

const renderTableCell = ({ input, ...other }) => {
  if (input && input.value) {
    return (<TableCell>{input.value}</TableCell>)
  } else {
    return (<TableCell>{`${''}`}</TableCell>)
  }
}
renderTableCell.propTypes = {
  input: PropTypes.object
}

const changeItemType = (val, change, field) => change ? change(field, val) : 'schematic'
const handleErrors = (response) => {
  console.log(response)
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

const processFiles = (files, change, changeFields, brand, model, custom, idx, existingId) => {
  const {setVersionData, setDataField} = custom
  if (files.length > 1) {
    console.warn('Cannot upload more than 1 file at a time!')
    return
  } else {
    change(changeFields.data, 'sch/' + brand + '/' + model + '/' + files[0].name)
    setDataField('sch/' + brand + '/' + model + '/' + files[0].name, idx)
    var formData = new FormData()
    formData.append('upfile', files[0])

    fetch('https://schematics.synchu.com/fileUploadAPI.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: formData
    })
          .then(response => handleErrors(response))
          .then(response => response.json())
          .then(json => {
            console.log(json)
            setVersionData(existingId, 'size', json.size)
            setVersionData(existingId, 'uploadname', json.uploadedname)
            // changes form bindings
            change(changeFields.size, json.size)
            change(changeFields.uploadname, json.uploadedname)
            return true
          })
          .catch(error => {
            console.log(error)
            return false
          })
    return true
  }
}

const renderTableRows = ({fields}, filesData, {...custom}) => {
  const {handleDeleteClick, change, brand, model} = custom
  return (
             fields.map((item, idx) => {
               return (
                 <TableRow key={idx}
                   style={filesData[idx] && (filesData[idx].id < 0) ? {backgroundColor: 'lavender'} : {}}>
                   <Field name={`${item}.version`} component={renderTableCell} />
                   <TableCell>
                     <Field
                       component={TypeSelector}
                       label='Item type'
                       name={`${item}.type`}
                       selection={filesData[idx] ? filesData[idx].type : 'Schematic'}
                       returnSelection={changeItemType}
                       change={change}
                       field={`${item}.type`}
                      />
                    </TableCell>
                    <Field name={`${item}.data`} component={renderTableCell} />
                    <Field name={`${item}.filename`} component={renderInputTableCell}
                      className={classes.tableDisplayName}
                      multiline
                      />
                    <TableCell>
                      <Field
                        component={FileDropzone}
                        label='Click or drag to upload file'
                        rkey={idx}
                        icon='file'
                        name={`${item}.file`}
                        processFiles={processFiles}
                        change={change}
                        brand={brand}
                        model={model}
                        changeFields={{data: `${item}.data`, size: `${item}.size`, uploadname: `${item}.uploadname`}}
                        custom={custom}
                        idx={idx}
                        existingFile={filesData[idx].data}
                        uploadFile={filesData[idx].uploadname}
                        existingId={filesData[idx].id}
                        multiple
                        table />
                    </TableCell>
                    <TableCell onClick={() => (handleDeleteClick(idx, filesData[idx] ? filesData[idx].id : 0))} >
                    {filesData[idx] && filesData[idx].delete}
                    </TableCell>
                  </TableRow>)
             }))
}
renderTableRows.propTypes = {
  fields: PropTypes.object
}

// es-lint react/prop-types off

const renderTable = ({fields, ...custom}) => {
  const {filesData} = custom
  if (filesData && filesData.length > 0) {
    return (
      <Table selectable={false}>
        <TableHead>
          <TableCell>Version</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Data</TableCell>
          <TableCell>Display name</TableCell>
          <TableCell>File</TableCell>
          <TableCell>...</TableCell>
        </TableHead>
        {renderTableRows({fields}, filesData, custom)}
      </Table>)
  } else {
    return (<div></div>)
  }
}
renderTable.propTypes = {
  fields: PropTypes.object
}
const selector = formValueSelector('UploadItem')
// es-lint react/prop-types on
export class UploadItem extends Component {
  state = {
    deletedItem: 0
  }
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
    addNewTableRow: PropTypes.func,
    deleteFileData: PropTypes.func,
    deletedFilesData: PropTypes.array,
    array: PropTypes.object,
    submitToDB: PropTypes.func,
    startProgress: PropTypes.func,
    progress: PropTypes.number,
    profile: PropTypes.object
  }

  constructor (props) {
    super(props)
  }

  componentDidMount = () => {
    this.props.loadBrandsDropdown()
  }

  componentWillUnmount = () => {
    console.log('componentWillUnmount:', this.props.filesData)
  }

  localHandleSubmit = (e: Event, props: Object) => {
    const {submitToDB, startProgress} = this.props
    startProgress()
    checkAmpItemExists(undefined, props.brand, props.model, props.version, submitToDB)
    return false
  // props.dispatch(successValidateEmail(e.email))
  // props.dispatch(successValidatePassword(e.password))
  // props.dispatch(receiveLogin({playblu_token: e.email}))
  }

  shouldComponentUpdate = (nextProps : Object, nextState: Object) => {
    return true
  }

  handleChange = (e: Event) => {
    const {brand, setBrand, change, array} = this.props
    if (this.state[e.target.name] !== e.currentTarget.value) {
      setBrand(brand !== e.currentTarget.value ? e.currentTarget.value : brand, change, array)
    }
  }

  handleModelChange = (e: Event) => {
    const {model, setModel, change, array} = this.props
    if (this.state[e.target.name] !== e.currentTarget.value) {
      setModel(model !== e.currentTarget.value ? e.currentTarget.value : model, change, array)
    }
  }

  handleVersionChange = (e: Event) => {
    const {version, setVersion, change, array} = this.props
    // force clean files table
    if (this.state[e.target.name] !== e.currentTarget.value) {
      array.removeAll('files')
      setVersion(version !== e.currentTarget.value ? e.currentTarget.value : version, change, array)
    }
  }

  handleAddTableRow = () => {
    const { addNewTableRow, change, array } = this.props
    addNewTableRow(change, array)
  }

  handleDeleteClick = (index: Number, row) => {
    const {deleteFileData, array} = this.props
    deleteFileData(row, index, array)
    this.setState({deletedItem: this.state.deletedItem + 1})
  }

  handleUndoFileDelete = () => {
    this.setState({deletedItem: this.state.deletedItem - 1})
  }

  handleFocus = (e: Event) => {
    this.setState({[e.target.name]: e.target.value})
    if (e.target.name.trim().toLowerCase() === 'contributor' && (!e.target.value)) {
      this.props.change('contributor', this.props.profile.name)
    }
  }

  render () {
    const { handleSubmit, pristine, reset,
    submitting, amps, models, versions, progress, brand, model, version} = this.props

    return (
      <div>
      <AppBar fixed flat type='horizontal' theme={classes}>
      <IndexLink to='/' activeClassName={classes.activeRoute}>
            <div className={classes.logo}>
              <Logo
                title='SchemA - the ultimate tube amps schematics archive'
                width='782'
                height='182'
                scale={(0.2 * Math.max(0.35, screen.width / 1980)).toString()} />
            </div>
          </IndexLink>
      </AppBar>
    <form onSubmit={handleSubmit(data => (this.localHandleSubmit(data, this.props)))} className={classes.container} >
      <div>
        <Card className={classes['ampitemcard']} raised >
          <CardTitle title='Edit/Create amp item' theme={classes} />
          <span style={{ display: 'flex', flexFlow: 'row wrap' }}>
            <Field name='brand' label='Brand'
              component={renderAutocompleteField}
              required
              type='search'
              hint='Type to choose brand...'
              direction='down'
              icon='search'
              className={classes.searchInput}
              source={amps}
              onBlur={this.handleChange}
              onFocus={this.handleFocus}
              warn={validators.minLength2}
              />
            <Field name='model' label='Model'
              component={renderAutocompleteField}
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
              onFocus={this.handleFocus}
              />
            <Field name='version' label='Version'
              component={renderAutocompleteField}
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
              onFocus={this.handleFocus}
              />
          </span>
          <Field name='description' component={renderField}
            type='text'
            label='Description' required
            icon='description'
            multiline />
          <Field name='contributor' component={renderField}
            type='text'
            label='Contributor' required
            icon='control_point'
            onFocus={this.handleFocus}
            />
          <div style={{display: 'flex', flexFlow: 'row nowrap', flex: '0 1 auto', alignItems: 'flex-start', justifyContent: 'flex-end'}}>
          {this.props.deletedFilesData && (this.props.deletedFilesData.length > 0) &&
            <IconButton icon='undo' title='Undo file item delete' onClick={this.handleUndoFileDelete}
               />}
            <IconButton icon='playlist_add' title='Add file item' disabled={!brand || !model || !version} onClick={this.handleAddTableRow}
            />
          </div>
          <FieldArray name='files' component={renderTable} props={this.props} filesData={this.props.filesData}
            handleDeleteClick={this.handleDeleteClick}
            change={this.props.change}
             />
          <CardActions className={classes['actions']}>
            <Button type='submit' label='Save' raised default
              disabled={submitting} />
            <Button type='button' label='Cancel' title='Clear the form'
              disabled={pristine || submitting} onClick={reset} />
            {
              (progress > 0) &&
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <ProgressBar theme={classes} type='circular' mode='determinate' value={progress} />
                  <span className={classes.saving}>Saving</span>
                </div>
            }
          </CardActions>
        </Card>
      </div>
    </form>
    </div>
    )
  }
}

export default reduxForm({
  form: 'UploadItem',  // a unique identifier for this form
  initialValues: { description: '', contributor: '',
    files: [{type: 'schematic', filename: '', file: {}}],
    brand: '', model: '', version: '' },
  validate
})(UploadItem)

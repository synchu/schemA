import React, { PropTypes, Component } from 'react'
import { Button, Table, Card, CardTitle,
  CardActions, Autocomplete, IconButton,
 TableHead, TableRow, TableCell} from 'react-toolbox'
import Input from 'react-toolbox/lib/input'
import { Field, reduxForm, FieldArray } from 'redux-form/immutable'
import { validatePassword } from '../../../utils/validators'
import { TypeSelector } from '../components/TypeSelector'
import { FileDropzone } from '../components/Dropzone'
import { validators } from '../modules/validateData'

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

renderField.propTypes = {
  input: PropTypes.object
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


const renderInputTableCell = ({ input, label, icon, meta: { touched, error, warning }, ...custom }) => {
  return (
    <TableCell>
      <Input {...input} label={label} icon={icon} error={touched ? error : ''} style={{ width: '80%' }} />
        {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
    </TableCell>
  )
}

renderTableCell.propTypes = {
  input: PropTypes.object
}
const renderTableCell = ({ input, ...other }) => {
  if (input && input.value) {
    return (<TableCell>{input.value}</TableCell>)
  } else {
    return (<TableCell>{`${''}`}</TableCell>)
  }
}

const changeItemType = (val, change, field) => change ? change(field, val) : 'schematic'

const processFiles = (files, change, field, brand, model) => {
  console.log('files:', files)
  if (files.length > 1) {
    console.warn('Cannot upload more than 1 file at a time!')
    return
  } else {
    change(field, 'sch/' + brand + '/' + model + '/' + files[0].name)
  }
}

renderTableRows.propTypes = {
  fields: PropTypes.object
}

const renderTableRows = ({fields}, filesData, {...custom}) => {
  const {handleDeleteClick, handleTableChange, change, brand, model} = custom
  console.log('custom:', custom)
  return (
             fields.map((item, idx) => {
               return (
                  <TableRow key={idx} onChange={handleTableChange}>
                    <Field name={`${item}.version`} component={renderTableCell} />
                    <TableCell>
                      <Field
                        component={TypeSelector}
                        label='Item type'
                        name={`${item}.type`}
                        selection={filesData[idx].type}
                        returnSelection={changeItemType}
                        change={change}
                        field={`${item}.type`}
                      />
                    </TableCell>
                    <Field name={`${item}.data`} component={renderTableCell} />
                    <Field name={`${item}.filename`} component={renderInputTableCell} />
                    <TableCell>
                      <Field
                        component={FileDropzone}
                        label='Click or drag to upload file'
                        icon='file'
                        name={`${item}.file`}
                        processFiles={processFiles}
                        change={change}
                        brand={brand}
                        model={model}
                        field={`${item}.file`}
                        multiple
                        table />
                    </TableCell>
                    <TableCell onClick={() => (handleDeleteClick(idx, filesData[idx] ? filesData[idx].id : 0))
                    }>{filesData[idx] && filesData[idx].delete}</TableCell>
                  </TableRow>)
             }))
}
// es-lint react/prop-types off
renderTable.propTypes = {
  fields: PropTypes.object
}

const renderTable = ({fields, ...custom}) => {
  const {filesData} = custom
  if (filesData && filesData.length > 0) {
    return (
      <Table>
        <TableHead>
          <TableCell>Version</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Data</TableCell>
          <TableCell>Display name</TableCell>
          <TableCell>File preview</TableCell>
          <TableCell>...</TableCell>
        </TableHead>
        {renderTableRows({fields}, filesData, custom)}
      </Table>)
  } else {
    return (<div></div>)
  }
}
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
    deletedFilesData: PropTypes.array
  }

  constructor (props) {
    super(props)
  }

  componentDidMount = () => {
    this.props.loadBrandsDropdown()
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
    const {brand, setBrand, change, array} = this.props
    setBrand(brand, change, array)
  }

  handleModelChange = (value) => {
    const {model, setModel, change, array} = this.props
    setModel(model, change, array)
  }

  handleVersionChange = (value) => {
    const {version, setVersion, change, array} = this.props
    console.log('versionchange:', value.currentTarget.value)
    setVersion(value.currentTarget.value, change, array)
    // clean da shit
    array.removeAll('files')
  }

  handleTableChange = (row, key, value) => {
    const { setFilesData } = this.props
    console.log(row, key, value)
    // setFilesData(row, key, value)
  }

  handleAddTableRow = () => {
    const { addNewTableRow, change, array } = this.props
    addNewTableRow(change, array)
  }

  handleDeleteClick = (index, row) => {
    const {deleteFileData, array} = this.props
    deleteFileData(row, index, array)
    this.setState({deletedItem: this.state.deletedItem + 1})
  }

  handleUndoFileDelete = () => {
    this.setState({deletedItem: this.state.deletedItem - 1})
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
              component={renderAutocompleteField}
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
            />
          <div style={{display: 'flex', flexFlow: 'row nowrap', flex: '0 1 auto', alignItems: 'flex-start', justifyContent: 'flex-end'}}>
          {this.props.deletedFilesData && (this.props.deletedFilesData.length > 0) &&
            <IconButton icon='undo' title='Undo file item delete' onClick={this.handleUndoFileDelete}
               />}
          <IconButton icon='playlist_add' title='Add file item' onClick={this.handleAddTableRow}
            />
          </div>
          <FieldArray name='files' component={renderTable} props={this.props}
            handleDeleteClick={this.handleDeleteClick} handleTableChange={this.handleTableChange}
            change={this.props.change}
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
  initialValues: { description: '', contributor: '', files: [{type: 'schematic', filename: '', file: {}}], brand: '', model: '', version: '' },
  validate
})(UploadItem)

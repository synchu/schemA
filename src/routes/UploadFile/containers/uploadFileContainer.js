import { connect } from 'react-redux'
import {formValueSelector} from 'redux-form'
import { loadBrandsDropdown, setFilesData, deleteFileData, addNewTableRow,
setBrand, setModel, setVersion } from '../modules/uploadFile'

import UploadItem from '../components/UploadItem'

const getMessage = (state) => {
  return state.errorMessage ? state.errorMessage : state.uploadFile.errorMessage
}

/*  Object of action creators (can also be function that returns object).
    Keys will be passed as props to presentational components. Here we are
    implementing our wrapper around increment; the component doesn't care   */

const mapActionCreators = {
  loadBrandsDropdown,
  setBrand,
  setModel,
  setVersion,
  setFilesData,
  deleteFileData,
  addNewTableRow
}

const selector = formValueSelector('UploadItem')

const mapStateToProps = (state) => ({
  errorMessage: getMessage(state),
  brands: state.uploadFile.brands,
  isFetching: state.uploadFile.isFetching,
  snackMessage: getMessage(state),
  models: state.uploadFile.models,
  versions: state.uploadFile.versions,
  item: state.uploadFile.item,
  ampVersions: state.uploadFile.ampVersions,
  amps: state.uploadFile.amps,
  rawdata: state.uploadFile.rawdata,
  brand: selector(state, 'brand'),
  model: selector(state, 'model'),
  version: selector(state, 'version'),
  // that's the form one
  description: selector(state, 'description'),
  // that's the DB selected one
  descriptionDb: state.uploadFile.description,
  contributor: selector(state, 'contributor'),
  filesData: state.uploadFile.filesData
})


export default connect(mapStateToProps, mapActionCreators)(UploadItem)

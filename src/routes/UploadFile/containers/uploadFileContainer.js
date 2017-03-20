import { connect } from 'react-redux'
import {formValueSelector} from 'redux-form'
import { loadBrandsDropdown, setFilesData, deleteFileData, addNewTableRow,
setBrand, setModel, setVersion, setDataField, submitToDB, startProgress, increaseProgress,
stopProgress } from '../modules/uploadFile'

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
  addNewTableRow,
  setDataField,
  submitToDB,
  startProgress,
  increaseProgress,
  stopProgress
}

const selector = formValueSelector('UploadItem')

const mapStateToProps = (state) => {
  // no need for that explicitly - used to trace it for good
  const lBrand = selector(state, 'brand')
  const lModel = selector(state, 'model')
  const lVersion = selector(state, 'version')
  const lContributor = selector(state, 'contributor')
  const lDescription = selector(state, 'description')
  let newProps = ({
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
    brand: lBrand,
    model: lModel,
    version: lVersion,
  // that's the form one
    description: lDescription,
  // that's the DB selected one
    descriptionDb: state.uploadFile.description,
    contributor: lContributor,
    filesData: state.uploadFile.filesData,
    versionData: state.uploadFile.versionData,
    deletedFilesData: state.uploadFile.deletedFilesData,
    deletedVersionData: state.uploadFile.deletedVersionData,
    profile: state.globalReducer.auth.getProfile(),
    progress: state.uploadFile.progress
  })
  return newProps
}


export default connect(mapStateToProps, mapActionCreators)(UploadItem)


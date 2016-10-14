import { connect } from 'react-redux'
import {formValueSelector} from 'redux-form'
import { loadBrandsDropdown, setDescription } from '../modules/uploadFile'

import UploadItem from '../components/UploadItem'

const getMessage = (state) => {
  return state.errorMessage ? state.errorMessage : state.uploadFile.errorMessage
}

/*  Object of action creators (can also be function that returns object).
    Keys will be passed as props to presentational components. Here we are
    implementing our wrapper around increment; the component doesn't care   */

const mapActionCreators = {
  loadBrandsDropdown,
  setDescription
}

const selector = formValueSelector('UploadItem')

const mapStateToProps = (state) => ({
  errorMessage: getMessage(state),
  brands: state.uploadFile.brands,
  isFetching: state.uploadFile.isFetching,
  snackMessage: getMessage(state),
  models: state.uploadFile.models,
  item: state.uploadFile.item,
  ampVersions: state.uploadFile.ampVersions,
  amps: state.uploadFile.amps,
  rawdata: state.uploadFile.rawdata,
  // description: state.uploadFile.description,
  brand: selector(state, 'brand'),
  model: selector(state, 'model'),
  version: selector(state, 'version'),
  description: selector(state, 'description')
})


export default connect(mapStateToProps, mapActionCreators)(UploadItem)

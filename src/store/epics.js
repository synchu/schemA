import 'rxjs'
import {loadItem, SELECT_MODEL, MODELS_SUCCESS} from '../routes/Home/modules/Home'
import {SET_FILES} from '../routes/UploadFile/modules/uploadFile'

export const selectModelEpic = (action$, store) => {
  return action$
    .ofType(MODELS_SUCCESS)
    .debounceTime(100)
    .map((action) => {
     // console.log('models_success')
     // console.log(store.getState().Home)
      if (store.getState().Home && !store.getState().Home.searching) {
        return ({
          type: SELECT_MODEL,
          selectedModel: action.models.length === 1
          ? action.models[0][1]
          : '',
          autoLoad: true
        })
      } else {
        return ({type: 'SEARCH_OFF', payload: 'selectModelEpic'})
      }
    })
}

export const loadItemEpic = (action$, store) => {
  // var model = ''
  return action$
    .ofType(SELECT_MODEL)
    .debounceTime(100)
    .map((action) => {
      // console.log('select_model')
      // console.log(store.getState().Home)
      let home = store.getState().Home
      if (home && !home.searching) {
        return (loadItem())
      } else {
        return ({type: 'SEARCHING', payload: action})
      }
    })
}

export const loadFieldsArray = (action$, store) => {
  // var model = ''
  return action$
    .ofType('TEST_NOTHING')
    .debounceTime(100)
    .map((action) => {
      console.log('uploadFileEpicState:', store.getState())
      let uploadFile = store.getState().form.UploadItem
      if (uploadFile && uploadFile.fields) {
        console.log('uploadFileEpicState.actiondata:', action)
        console.log('epic fieldarray:', uploadFile.fields)
        // uploadFile.fields.push({})
        return ({type: 'REFRESH_FIELDS_ARRAY', payload: action})
      } else {
        return ({type: 'REFRESH_FIELDS_ARRAY', payload: action})
      }
    })
}


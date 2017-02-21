import 'rxjs'
import {loadItem, SELECT_MODEL, MODELS_SUCCESS} from '../routes/Home/modules/Home'

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

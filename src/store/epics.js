import 'rxjs'
import {loadItem} from '../routes/Home/modules/Home'

export const selectModelEpic = (action$, store) => {
  return action$
    .ofType('MODELS_SUCCESS')
    .debounceTime(300)
    .map((action) => {
     // console.log('models_success')
     // console.log(store.getState().Home)
      if (store.getState().Home && !store.getState().Home.searching) {
        return ({
          type: 'SELECT_MODEL',
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
    .ofType('SELECT_MODEL')
    .debounceTime(200)
    .map((action) => {
      // console.log('select_model')
      // console.log(store.getState().Home)
      if (store.getState().Home && !store.getState().Home.searching) {
        return (loadItem())
      } else {
        return ({type: 'SEARCHING', payload: action})
      }
    })
}

import 'rxjs'
import {loadItem} from '../routes/Home/modules/Home'

export const selectModelEpic = action$ => {
  // var model = ''
  return action$
    .ofType('MODELS_SUCCESS')
    .debounceTime(400)
    .map((action) => {
      return ({
        type: 'SELECT_MODEL',
        selectedModel: action.models.length === 1
          ? action.models[0][1]
          : '',
        autoLoad: true
      })
    })
}

export const loadItemEpic = action$ => {
  // var model = ''
  return action$
    .ofType('SELECT_MODEL')
    .debounceTime(200)
    .map((action) => {
      return (loadItem())
    })
}

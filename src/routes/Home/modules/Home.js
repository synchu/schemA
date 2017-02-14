/* @flow*/

import fetch from 'isomorphic-fetch'
// import Rx from 'rxjs'
// ------------------------------------ Constants
// ------------------------------------
export const BRANDS_REQUEST = 'BRANDS_REQUEST'
export const BRANDS_SUCCESS = 'BRANDS_SUCCESS'
export const BRANDS_FAILURE = 'BRANDS_FAILURE'

export const MODELS_REQUEST = 'MODELS_REQUEST'
export const MODELS_SUCCESS = 'MODELS_SUCCESS'
export const MODELS_FAILURE = 'MODELS_FAILURE'

export const ITEM_REQUEST = 'ITEM_REQUEST'
export const ITEM_SUCCESS = 'ITEM_SUCCESS'
export const ITEM_FAILURE = 'ITEM_FAILURE'

export const AMPS_REQUEST = 'AMPS_REQUEST'
export const AMPS_SUCCESS = 'AMPS_SUCCESS'
export const AMPS_FAILURE = 'AMPS_FAILURE'

export const SELECT_BRAND = 'SELECT_BRAND'
export const FILTER_BRAND = 'FILTER_BRAND'
export const SELECT_MODEL = 'SELECT_MODEL'
export const FILTER_MODELS = 'FILTER_MODELS'

export const SET_PIN_NAVBAR = 'SET_PIN_NAVBAR'
export const SET_ACTIVE_NAVBAR = 'SET_ACTIVE_NAVBAR'

// ------------------------------------ Utils
// ------------------------------------

const addKey = (items) => {
  let j = 0
  return items.map((i) => Object.assign({}, i, {
    key: j++
  }))
}

// ------------------------------------ Actions
export const observableFetch = () => {
  return (dispatch) => {
    return
    // const response = fetch('http://thesubjectmatter.com/api.php/brand_stats')
    // console.log(response)
   /* const brands$ = Rx
      .Observable
      .fromPromise(fetch('http://thesubjectmatter.com/api.php/brand_stats').then(response => response.json()).then(json => json.brand_stats.records))
    let j = 0
    const subs = brands$.subscribe(x => x.map(a => console.log(Object.assign({}, a, {
      key: j++
    })), e => console.error(e)))

    return subs*/
  }
}

export const requestBrands = () => {
  return {type: BRANDS_REQUEST, isFetching: true}
}

export const errorBrands = (message : string) => {
  return {type: BRANDS_FAILURE, errorMessage: message, snackMessage: message, isFetching: false}
}

export const successBrands = (brands) => {
  return {type: BRANDS_SUCCESS, brands: (brands)}
}

export const fetchBrands = () => {
  return (dispatch) => {
    dispatch(requestBrands())
    if (self.fetch) {
      return (fetch('http://thesubjectmatter.com/api.php/brand_stats').then((response) => response.json()).then((json) => {
        dispatch(successBrands(json.brand_stats.records))
      }))
    } else {
      console.warn('Fetch API not available! Attempting to load brands anyway. Other data may not be av' +
          'ailable!')
      if (window.XMLHttpRequest) {
        let xhttp = new XMLHttpRequest()
        xhttp.open('GET', 'http://thesubjectmatter.com/api.php/brand_stats', false)
        xhttp.send()
        let json = xhttp
          .responseText
          .json()
        if (json) {
          dispatch(successBrands(json.brand_stats.records))
        }
      } else {
        console.warn('Sad days are comming. NO server request API available at all!')
      }
    }
  }
}

export const loadBrands = () => {
  // TODO: caching and pagination
  return (dispatch, getState) => {
    if (getState().Home.brands && (getState().Home.brands.length > 0)) {
      return dispatch(errorBrands('Still no caching... sorry pal'))
    }
    return dispatch(fetchBrands())
  }
}

export const requestModels = () => {
  return {type: MODELS_REQUEST, isFetchingModels: true}
}

export const errorModels = (message : string) => {
  return {type: MODELS_FAILURE, errorMessage: message, snackMessage: message, isFetchingModels: false}
}

export const successModels = (models) => {

  return {type: MODELS_SUCCESS, models: (models), isFetchingModels: false}
}

export const fetchModels = (brand) => {
  return (dispatch) => {
    dispatch(requestModels())
    return (fetch('http://thesubjectmatter.com/api.php/brand_models_stats?filter=brand,eq,' + brand.trim()).then((response) => response.json()).then((json) => {
      dispatch(successModels(json.brand_models_stats.records))
    }))
  }
}

export const loadModels = () => {
  // TODO: caching and pagination
  return (dispatch, getState) => {
    if (getState().Home.models && (getState().Home.models.length > 0)) {
      if (getState().Home.models[0][0] === getState().Home.selectedBrand) {
        console.log('cache hit for models load')
        console.log(getState().Home.models[0][0])
        return
      }
    }
    return dispatch(fetchModels(getState().Home.selectedBrand))
  }
}

export const requestItem = () => {
  return {type: ITEM_REQUEST, isFetching: true}
}

export const errorItem = (message : string) => {
  return {type: ITEM_FAILURE, errorMessage: message, snackMessage: message, isFetching: false}
}

export const successItem = (item) => {
  return {type: ITEM_SUCCESS, item: addKey(item)}
}

export const fetchItem = (brand, model) => {
  return (dispatch) => {
    dispatch(requestItem())
    return (fetch('http://thesubjectmatter.com/api.php/schematics?order=version,asc&filter=brand,eq' +
        ',' + brand.trim() + '&transform=1').then((response) => response.json()).then((json) => {
          dispatch(successItem(json.schematics.filter(i => i.model.toLowerCase() === model.toLowerCase().trim())))
        }))
  }
}

export const loadItem = (forceLoad = false) => {
  // TODO: caching and pagination
  return (dispatch, getState) => {
    if (getState().Home.item && (getState().Home.item.length > 0) && !forceLoad) {
      // check first record model against the selected one
      if (getState().Home.item[0].model === getState().Home.selectedModel) {
        return
      }
    }
    return dispatch(fetchItem(getState().Home.selectedBrand, getState().Home.selectedModel))
  }
}

export const requestAmps = () => {
  return {type: AMPS_REQUEST, isFetching: true}
}

export const errorAmps = (message : string) => {
  return {type: AMPS_FAILURE, errorMessage: message, snackMessage: message, isFetching: false}
}

const transformAmpsToAutocomplete = (ampsWithKeys) => {
  let c = {}
  ampsWithKeys.map((a) => {
    console.log(a[3])
    c = Object.defineProperty(c, a[3].toString(), {
      enumerable: true,
      configurable: false,
      writable: true,
      value: a[0] + ', ' + a[1] + ', ' + a[2]
    })
  })
  console.log(c)
  return c
}

export const successAmps = (amps) => {
  return {
    type: AMPS_SUCCESS,
    ampVersions: transformAmpsToAutocomplete((amps))
  }
}

export const fetchAmpsVersions = () => {
  return (dispatch) => {
    dispatch(requestAmps())
    return (
      fetch('http://thesubjectmatter.com/api.php/versions?order=version,asc')
      .then((response) => response.json())
      .then((json) => {
        dispatch(successAmps(json.versions.records))
      }))
  }
}

export const loadAmpsVersions = () => {
  // TODO: caching and pagination
  return (dispatch, getState) => {
    if (getState().Home.ampVersions && (getState().Home.ampVersions.length > 0)) {
      console.log('amp versions cache hit')
      return
    }
    return dispatch(fetchAmpsVersions())
  }
}

export const selectBrand = (brand) => {
  return (dispatch) => {
    dispatch({type: SELECT_BRAND, selectedBrand: brand})
  }
}

export const selectModel = (model) => {
  return (dispatch) => {
    dispatch({type: SELECT_MODEL, selectedModel: model})
  }
}

export const filterBrand = (value) => {
  return (dispatch) => {
    dispatch({type: FILTER_BRAND, filteredBrand: value})
  }
}

export const filterModels = (value) => {
  return (dispatch) => {
    dispatch({type: FILTER_MODELS, filteredModels: value})
  }
}

export const setNavbarPinned = (value) => {
  return (dispatch) => {
    dispatch({type: SET_PIN_NAVBAR, navbarPinned: value})
  }
}

export const setNavbarActive = (value) => {
  return (dispatch) => {
    dispatch({type: SET_ACTIVE_NAVBAR, navbarActive: value})
  }
}

const addToSelectedModels = (state, item) => {
  let selectedModels = state.selectedModelsList
  selectedModels.push(item)
  return selectedModels
}

// some export if needed to call externally
export const actions = {
  loadBrands,
  loadModels,
  selectBrand,
  filterBrand,
  filterModels,
  setNavbarActive,
  setNavbarPinned,
  loadAmpsVersions
}

// ------------------------------------ Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [BRANDS_REQUEST]: (state, action) => Object.assign({}, state, {isFetching: true}),
  [BRANDS_FAILURE]: (state, action) => Object.assign({}, state, {
    isFetching: false,
    errorMessage: action.errorMessage,
    snackMessage: action.snackMessage
  }),
  [BRANDS_SUCCESS]: (state, action) => Object.assign({}, state, {
    isFetching: false,
    brands: action.brands
  }),
  [MODELS_REQUEST]: (state, action) => Object.assign({}, state, {isFetchingModels: true}),
  [MODELS_FAILURE]: (state, action) => Object.assign({}, state, {
    isFetchingModels: false,
    errorMessage: action.errorMessage,
    snackMessage: action.snackMessage
  }),
  [MODELS_SUCCESS]: (state, action) => Object.assign({}, state, {
    isFetchingModels: false,
    models: action.models
  }),
  [ITEM_REQUEST]: (state, action) => Object.assign({}, state, {isFetching: true}),
  [ITEM_FAILURE]: (state, action) => Object.assign({}, state, {
    isFetching: false,
    errorMessage: action.errorMessage,
    snackMessage: action.snackMessage
  }),
  [ITEM_SUCCESS]: (state, action) => Object.assign({}, state, {
    isFetching: false,
    item: action.item
  }),
  [AMPS_REQUEST]: (state, action) => Object.assign({}, state, {isFetching: true}),
  [AMPS_FAILURE]: (state, action) => Object.assign({}, state, {
    isFetching: false,
    errorMessage: action.errorMessage,
    snackMessage: action.snackMessage
  }),
  [AMPS_SUCCESS]: (state, action) => Object.assign({}, state, {
    isFetching: false,
    ampVersions: action.ampVersions
  }),
  [SELECT_BRAND]: (state, action) => Object.assign({}, state, {selectedBrand: action.selectedBrand}),
  [FILTER_BRAND]: (state, action) => Object.assign({}, state, {filteredBrand: action.filteredBrand}),
  [FILTER_MODELS]: (state, action) => Object.assign({}, state, {filteredModels: action.filteredModels}),
  [SELECT_MODEL]: (state, action) => Object.assign({}, state, {
    selectedModel: action.selectedModel,
    selectedModelsList: addToSelectedModels(state, action.selectedModel)
  }),
  [SET_PIN_NAVBAR]: (state, action) => Object.assign({}, state, {navbarPinned: action.navbarPinned}),
  [SET_ACTIVE_NAVBAR]: (state, action) => Object.assign({}, state, {navbarActive: action.navbarActive})
}

// ------------------------------------ Reducer
// ------------------------------------
const initialState = {
  isFetching: false,
  isAuthenticated: localStorage.getItem('schemarch_token')
    ? true
    : false,
  user: {
    userId: '',
    email: '',
    firstname: '',
    lastname: '',
    username: ''
  },
  brands: [],
  errorMessage: '',
  snackMessage: '',
  filteredBrand: '',
  selectedBrand: '',
  filteredModels: '',
  selectedModel: '',
  selectedModelsList: [],
  models: [],
  item: [],
  navbarActive: false,
  navbarPinned: true,
  ampVersions: {},
  isFetchingModels: false
}
export default function BrandsReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler
    ? handler(state, action)
    : state
}

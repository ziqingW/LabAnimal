const clone = require('clone')

var initialState = {
  username: '',
  userId: 0,
  species: "",
  editAnimals : [],
  selectedHeaders : [],
  headerPass : false
}

export function labAnimal (state, action) {
  if (state === undefined) {
    return initialState
  }
  var new_state
  switch (action.type) {
    case 'GET_USER':
      new_state = clone(state)
      let data = JSON.parse(action.data)
      new_state.username = data.username
      new_state.userId = data.userId
      return new_state
    case 'GET_ANIMAL':
      new_state = clone(state)
      let editAnimals = action.data
      new_state.editAnimals = editAnimals
      return new_state
    case 'GET_HEADERS':
      new_state = clone(state)
      let selectedHeaders = action.data
      new_state.selectedHeaders = selectedHeaders
      return new_state
    case 'CHECK_HEADERS':
      new_state = clone(state)
      let headerPass = action.data
      new_state.headerPass = headerPass
      return new_state
    default:
      return state
  }
}

export default labAnimal

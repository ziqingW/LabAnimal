const clone = require('clone')

var initialState = {
  username: '',
  userId: 0,
  species: ""
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
    default:
      return state
  }
}

export default labAnimal

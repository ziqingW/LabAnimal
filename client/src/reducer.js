const clone = require('clone')

var initialState = {
  username: '',
  userId: 0
}

export function labAnimal (state, action) {
  if (state === undefined) {
    return initialState
  }
  var new_state
  switch (action.type) {
    case 'GET_USER':
      new_state = clone(state)
      // data = JSON.parse(action.data)
      new_state.username = action.data.username
      new_state.userId = action.data.userId
      return new_state
    default:
      return state
  }
}

export default labAnimal

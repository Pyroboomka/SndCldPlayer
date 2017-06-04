import { SET_WIDTH } from '../actions/environmentActions'

const initialEnvState = {
  width: 0,
  height: 0
}

function environment (state = initialEnvState, action) {
  switch (action.type) {
    case (SET_WIDTH):
      return Object.assign({}, state, { width: action.width })
    default:
      return state
  }
}

export default environment

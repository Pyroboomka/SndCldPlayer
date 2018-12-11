import { UPDATE_ENVIRONMENT } from '../actions/environment'

const initialState = {
  width: 0,
  height: 0,
}

function environment(state = initialState, { type, payload }) {
  switch (type) {
    case UPDATE_ENVIRONMENT:
      return { ...state, width: payload.width, height: payload.height }
    default:
      return state
  }
}

export default environment

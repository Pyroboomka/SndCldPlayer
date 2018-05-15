import { UPDATE_ENVIRNOMENT } from '../actions/environment'

const initialState = {
  width: 0,
  height: 0,
}

function environment(state = initialState, action) {
  switch (action.type) {
    case UPDATE_ENVIRNOMENT:
      return { ...state,
        width: action.payload.width,
        height: action.payload.height,
       }
    default:
      return state
  }
}

export default environment

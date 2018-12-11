export const SET_WIDTH = 'SET_WIDTH'
export const UPDATE_ENVIRONMENT = 'UPDATE_ENVIRONMENT'

export function setWidth(width) {
  return {
    type: SET_WIDTH,
    payload: width,
  }
}

export function updateEnvironment(width, height) {
  return {
    type: UPDATE_ENVIRONMENT,
    payload: {
      width,
      height,
    },
  }
}


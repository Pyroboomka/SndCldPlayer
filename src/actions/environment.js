export const SET_WIDTH = 'SET_WIDTH'
export const UPDATE_ENVIRNOMENT = 'UPDATE_ENVIRNOMENT'

export function setWidth(width) {
  return {
    type: SET_WIDTH,
    payload: width,
  }
}

export function updateEnvironment(width, height) {
  return {
    type: UPDATE_ENVIRNOMENT,
    payload: {
      width,
      height,
    },
  }
}


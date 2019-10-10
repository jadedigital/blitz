export const SET_DATA = (state, payload) => {
  let obj = payload.data
  if (Object.keys(obj).length === 0 && obj.constructor === Object && payload.type === 'pointsAllowed') {
    console.log('Empty object. Maintaining current state')
  } else {
    state[payload.type] = payload.data
  }
}
export const API_TIMESTAMP = (state, payload) => {
  state.api[payload.type].timeStamp = payload.data
}
export const TOGGLE_DATA = (state, payload) => {
  state[payload] = state[payload] * -1
}
export const LOGOUT = (state) => {
  state['token'] = ''
}
export const SAVE_SETTINGS = (state, payload) => {
  state.settings[payload.type] = payload.data
}
export const CLEAR_TIMESTAMPS = (state, payload) => {
  payload.types.forEach(el => {
    state.api[el].timeStamp = 0
  })
}

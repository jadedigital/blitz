/*
export const someMutation = (state) => {
}
*/
export const SET_DATA = (state, payload) => {
  state[payload.type] = payload.data
}
export const TOGGLE_DATA = (state, payload) => {
  state[payload] = state[payload] * -1
}

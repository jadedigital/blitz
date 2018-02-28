import { version } from '../../../package.json'

export const SET_DATA = (state, payload) => {
  state[payload.type] = payload.data
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
export const INITIALIZE_STORE = (state) => {
  // Check if the store exists
  if (localStorage.getItem('store')) {
    let store = JSON.parse(localStorage.getItem('store'))

    // Check the version stored against current. If different, don't
    // load the cached version
    if (store.version === version) {
      this.replaceState(
        Object.assign(state, store)
      )
    } else {
      state.version = version
    }
  }
}

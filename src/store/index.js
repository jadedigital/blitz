import Vue from 'vue'
import Vuex from 'vuex'

import main from './module-main'

Vue.use(Vuex)

const watchStore = store => {
  store.subscribe((mutation, state) => {
    var time = Date.now()
    localStorage.setItem('leagueData_time', time)
    localStorage.setItem('store', JSON.stringify(state))
  })
}

const store = new Vuex.Store({
  modules: {
    main
  },
  plugins: [watchStore]
})

export default store

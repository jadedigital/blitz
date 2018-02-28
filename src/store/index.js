import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import main from './main'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    main
  },
  plugins: [createPersistedState()]
})

export default store

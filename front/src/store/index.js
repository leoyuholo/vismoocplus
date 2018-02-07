import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  lectures: [],
  userSetting: {},
  user: null
}

const store = new Vuex.Store({
  strict: true,
  state,
  getters,
  actions,
  mutations
})

export default store

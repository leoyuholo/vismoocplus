import Vue from 'vue'
import Vuex from 'vuex'
import Parse from 'parse'

import user from './user'
import lecture from './lecture'
import event from './event'

Vue.use(Vuex)

const parseConfig = process.env.parseConfig
Parse.initialize(parseConfig.appId)
Parse.serverURL = parseConfig.serverURL

const store = new Vuex.Store({
  strict: process.env.NODE_ENV === 'development',
  modules: {
    user,
    lecture,
    event
  },
  actions: {
    init ({ dispatch }) {
      dispatch('user/init')
    }
  },
  getters: {
    lectureId: state => state.route.params.lectureId,
    courseId: state => state.route.params.courseId
  }
})

export default store

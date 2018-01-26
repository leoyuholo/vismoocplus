import Parse from 'parse'

import Lecture from './models/Lecture'

const parseConfig = process.env.parseConfig

export default {
  init ({ commit }) {
    Parse.initialize(parseConfig.appId)
    Parse.serverURL = parseConfig.serverURL
    commit('init')
  },
  createLecture ({ commit }, lecture) {
    return Lecture.create(lecture)
      .then(lecture => {
        commit('addLecture', lecture)
        return lecture
      })
  },
  getLectures ({ commit }) {
    return Lecture.find()
      .then(lectures => commit('setLectures', lectures))
  },
  updateLecture ({ dispatch }, { id, changes }) {
    return Lecture.update(id, changes)
      .then(() => dispatch('getLectures'))
  },
  deleteLecture ({ commit }, { id }) {
    return Lecture.destroy(id)
      .then(() => commit('removeLecture', id))
  }
}

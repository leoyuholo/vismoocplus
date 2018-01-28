import Parse from 'parse'

import Lecture from './models/Lecture'

const parseConfig = process.env.parseConfig

export default {
  init ({ commit }) {
    Parse.initialize(parseConfig.appId)
    Parse.serverURL = parseConfig.serverURL
    commit('init', Parse.User.current())
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
      .then(lectures => {
        commit('setLectures', lectures)
        return lectures
      })
  },
  updateLecture ({ dispatch }, { id, changes }) {
    return Lecture.update(id, changes)
      .then(() => dispatch('getLectures'))
  },
  deleteLecture ({ commit }, { id }) {
    return Lecture.destroy(id)
      .then(() => commit('removeLecture', id))
  },
  signup ({ commit }, { email, password }) {
    const user = new Parse.User()
    user.set('username', email)
    user.set('email', email)
    user.set('password', password)

    return user.signUp()
      .then(user => {
        commit('setUser', user)
        return user
      })
  },
  login ({ commit }, { email, password }) {
    return Parse.User.logIn(email, password)
      .then(user => {
        commit('setUser', user)
        return user
      })
  },
  forgot ({ commit }, { email }) {
    return Parse.User.requestPasswordReset(email)
  },
  logout ({ commit }) {
    return Parse.User.logOut()
      .then(() => {
        commit('setUser', null)
      })
  }
}

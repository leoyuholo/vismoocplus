import Parse from 'parse'

import Lecture from './models/Lecture'
import Event from './models/Event'
import UserSetting from './models/UserSetting'
import patch from '../patches'

const parseConfig = process.env.parseConfig

export default {
  init ({ dispatch, commit }) {
    Parse.initialize(parseConfig.appId)
    Parse.serverURL = parseConfig.serverURL

    patch()

    return commit('init', Parse.User.current())
  },
  getUserSetting ({ commit }) {
    return UserSetting.get()
      .then(userSetting => commit('setUserSetting', userSetting))
  },
  saveUserSetting ({ commit, state }, { changes, lectureProgress }) {
    if (!state.userSetting) {
      return
    }

    if (lectureProgress) {
      Object.entries(lectureProgress).forEach(([k, v]) => {
        changes['progress_' + k] = v
      })
    }

    return UserSetting.save(changes)
      .then(userSetting => commit('setUserSetting', userSetting))
  },
  track ({ commit }, { eventName, dimensions, options = {} }) {
    return Event.track(eventName, dimensions, options)
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
  updateLecture ({ commit }, { id, changes }) {
    return Lecture.update(id, changes)
      .then(lecture => commit('setLecture', lecture))
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
      .then(user => commit('setUser', user))
  },
  forgot ({ commit }, { email }) {
    return Parse.User.requestPasswordReset(email)
  },
  logout ({ commit }) {
    return Parse.User.logOut()
      .then(() => commit('setUser', null))
  },
  resend ({ commit }, { email }) {
    return Parse.User.resendVerificationEmail(email)
  }
}

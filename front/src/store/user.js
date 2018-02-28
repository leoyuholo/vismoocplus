import Parse from 'parse'

import { errorHandler } from 'src/helpers'

class UserSetting extends Parse.Object {
  constructor () {
    super('UserSetting')
  }

  static get () {
    if (!Parse.User.current()) {
      return Promise.reject(new Error("User hasn't logged in."))
    }

    const user = Parse.User.current()
    if (user.get('userSetting')) {
      return user.get('userSetting')
        .fetch()
        .catch(errorHandler)
    }
    else {
      const userSetting = new UserSetting()
      userSetting.setACL(user)
      user.set('userSetting', userSetting)
      return userSetting.save()
        .then(userSetting => user.save())
        .then(() => userSetting)
        .catch(errorHandler)
    }
  }
}

function patchParseUser () {
  Parse.User.resendVerificationEmail = (email, options) => {
    const RESTController = Parse.CoreManager.getRESTController()
    return RESTController.request(
      'POST',
      `verificationEmailRequest`,
      { email },
      options
    )
  }
}

patchParseUser()

export default {
  namespaced: true,
  state: {
    currentUser: null,
    userSetting: null
  },
  actions: {
    init ({ commit, dispatch }) {
      if (Parse.User.current()) {
        commit('setUser', Parse.User.current())
        dispatch('fetch')
      }
    },
    signup ({ commit }, { email, password }) {
      const user = new Parse.User()
      user.set('username', email)
      user.set('email', email)
      user.set('password', password)

      return user.signUp()
        .then(user => commit('setUser', user))
    },
    login ({ commit, dispatch }, { email, password }) {
      return Parse.User.logIn(email, password)
        .then(user => commit('setUser', user))
        .then(() => dispatch('fetchUserSetting'))
    },
    fetch ({ commit, dispatch }) {
      return Parse.User.current().fetch()
        .then(user => commit('setUser', user))
        .then(() => dispatch('fetchUserSetting'))
    },
    forgot ({ commit }, { email }) {
      return Parse.User.requestPasswordReset(email)
    },
    logout ({ commit }) {
      return Parse.User.logOut()
        .then(() => commit('setUser', null))
        .then(() => commit('setUserSetting', null))
    },
    resend ({ commit }, { email }) {
      return Parse.User.resendVerificationEmail(email)
    },
    fetchUserSetting ({ commit }) {
      if (!Parse.User.current()) {
        return Promise.reject(new Error("User hasn't logged in."))
      }

      return UserSetting.get()
        .then(userSetting => commit('setUserSetting', userSetting))
    },
    saveUserSetting ({ commit, state }, { changes, lectureProgress }) {
      if (!Parse.User.current()) {
        return Promise.reject(new Error("User hasn't logged in."))
      }

      if (lectureProgress) {
        Object.entries(lectureProgress).forEach(([k, v]) => {
          changes['progress_' + k] = Math.floor(v)
        })
      }

      return state.parseUserSetting.save(changes)
        .then(userSetting => commit('setUserSetting', userSetting))
    }
  },
  mutations: {
    setUser (state, user) {
      if (user) {
        state.parseUser = user
        state.currentUser = user.toJSON()
      }
      else {
        state.parseUser = null
        state.currentUser = null
      }
    },
    setUserSetting (state, userSetting) {
      if (userSetting) {
        state.parseUserSetting = userSetting
        state.userSetting = userSetting.toJSON()
      }
      else {
        state.parseUserSetting = null
        state.userSetting = null
      }
    }
  },
  getters: {
    allowStudio: state => state.currentUser ? state.currentUser.allowStudio : false,
    allowAnalytics: state => state.currentUser ? state.currentUser.allowAnalytics : false,
    lectureProgress: state => lectureId => state.userSetting ? state.userSetting['progress_' + lectureId] || 0 : 0
  }
}

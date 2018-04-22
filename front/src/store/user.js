import Parse from 'parse'

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
    }
    else {
      const userSetting = new UserSetting()
      userSetting.setACL(user)
      user.set('userSetting', userSetting)
      return userSetting.save()
        .then(userSetting => user.save())
        .then(() => userSetting)
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
    userSetting: null,
    initialized: false,
    initError: null
  },
  actions: {
    init ({ commit, dispatch }) {
      let chain = Promise.resolve()

      if (Parse.User.current()) {
        chain = chain.then(() => dispatch('fetch'))
      }

      return chain
        .then(() => commit('initialized'))
        .catch(error => commit('initError', error))
    },
    signup ({ commit }, { email, password }) {
      const user = new Parse.User()
      user.set('username', email)
      user.set('email', email)
      user.set('password', password)

      return user.signUp()
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

      if (process.env.verifyUserEmails && !Parse.User.current().get('emailVerified')) {
        return Promise.reject(new Error('User email is not verified.'))
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
    initialized (state) {
      state.initialized = true
    },
    initError (state, error) {
      state.initialized = true
      if (error && error.message.startsWith('Cannot modify user')) {
        state.initError = new Error('Invalid session. Try log in again.')
      }
      else {
        state.initError = error
      }
    },
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

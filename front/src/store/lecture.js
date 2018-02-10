import Parse from 'parse'

import { errorHandler, compareDate } from 'src/helpers'

class Lecture extends Parse.Object {
  constructor () {
    super('Lecture')
  }

  static create ({ courseId, name, description, videoUrl, posterUrl, captionUrl, releaseDate }) {
    const acl = new Parse.ACL()
    acl.setPublicReadAccess(true)
    acl.setWriteAccess(Parse.User.current().id, true)

    const lecture = new Lecture()
    lecture.setACL(acl)

    return lecture.save({
      courseId,
      name,
      description,
      videoUrl,
      posterUrl,
      captionUrl,
      releaseDate
    })
      .then(lecture => lecture.toJSON())
      .catch(errorHandler)
  }

  static find () {
    const query = new Parse.Query(Lecture)
    return query.find()
      .then(lectures => lectures.map(l => l.toJSON()))
      .catch(errorHandler)
  }

  static update (id, changes) {
    const query = new Parse.Query(Lecture)
    return query.get(id)
      .then(lecture => {
        Object.entries(changes).forEach(([k, v]) => {
          lecture.set(k, v)
        })
        return lecture.save()
          .then(lecture => lecture.toJSON())
      })
      .catch(errorHandler)
  }

  static destroy (id) {
    const query = new Parse.Query(Lecture)
    return query.get(id)
      .then(lecture => lecture.destroy())
      .catch(errorHandler)
  }
}

export default {
  namespaced: true,
  state: {
    lectures: []
  },
  actions: {
    create ({ commit }, lecture) {
      return Lecture.create(lecture)
        .then(lecture => {
          commit('add', lecture)
          return lecture
        })
    },
    getLectures ({ commit }, { courseId }) {
      return Lecture.find()
        .then(lectures => {
          commit('setLectures', lectures)
          return lectures
        })
    },
    update ({ commit }, { lectureId, changes }) {
      return Lecture.update(lectureId, changes)
        .then(lecture => {
          commit('update', lecture)
          return lecture
        })
    },
    delete ({ commit }, { lectureId }) {
      return Lecture.destroy(lectureId)
        .then(() => commit('remove', lectureId))
    }
  },
  mutations: {
    setLectures (state, lectures) {
      state.lectures = lectures
    },
    update (state, lecture) {
      state.lectures = state.lectures.map(l => l.objectId === lecture.objectId ? lecture : l)
    },
    add (state, lecture) {
      state.lectures = state.lectures.concat(lecture)
    },
    remove (state, lectureId) {
      state.lectures = state.lectures.filter(l => l.objectId !== lectureId)
    }
  },
  getters: {
    list: state => state.lectures.filter(l => !l.releaseDate || compareDate(l.releaseDate, Date.now()) <= 0),
    get: state => lectureId => state.lectures.find(l => l.objectId === lectureId),
    current: (state, getters, rootState, rootGetters) => getters.get(rootGetters.lectureId)
  }
}

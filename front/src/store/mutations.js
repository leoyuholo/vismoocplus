
export default {
  init (state, user) {
    state.started = true
    state.user = user
  },
  setLectures (state, lectures) {
    state.lectures = lectures
  },
  setLecture (state, lecture) {
    state.lectures = state.lectures.map(l => l.objectId === lecture.objectId ? lecture : l)
  },
  addLecture (state, lecture) {
    state.lectures = state.lectures.concat(lecture)
  },
  removeLecture (state, id) {
    state.lectures = state.lectures.filter(l => l.objectId !== id)
  },
  setUser (state, user) {
    state.user = user
  }
}

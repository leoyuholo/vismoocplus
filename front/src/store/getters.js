
export default {
  started: state => state.started,
  lectures: state => state.lectures,
  lectureId: state => state.route.params.lectureId,
  courseId: state => state.route.params.courseId,
  lecture: (state, getters) => state.lectures.find(l => l.objectId === getters.lectureId),
  userAdmin: state => state.user ? state.user.get('admin') : undefined
}

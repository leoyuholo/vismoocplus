
export default {
  lectureId: state => state.route.params.lectureId,
  courseId: state => state.route.params.courseId,
  lecture: (state, getters) => state.lectures.find(l => l.objectId === getters.lectureId),
  userAdmin: state => state.user.get('admin'),
  lectureProgress: state => lectureId => state.userSetting ? state.userSetting['progress_' + lectureId] || 0 : 0
}

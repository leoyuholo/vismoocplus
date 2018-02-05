import { compareDate } from '../helpers'

export default {
  lectureId: state => state.route.params.lectureId,
  courseId: state => state.route.params.courseId,
  lectures: state => state.lectures.filter(l => !l.releaseDate || compareDate(l.releaseDate, Date.now()) <= 0),
  lecture: (state, getters) => state.lectures.find(l => l.objectId === getters.lectureId),
  userAdmin: state => state.user.get('admin'),
  lectureProgress: state => lectureId => state.userSetting ? state.userSetting['progress_' + lectureId] || 0 : 0
}

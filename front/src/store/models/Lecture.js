import Parse from 'parse'
import { errorHandler } from '../../helpers'

class Lecture extends Parse.Object {
  constructor () {
    super('Lecture')
  }

  static create ({ courseId, name, description, videoFile, posterFile }) {
    const video = new Parse.File(`${courseId}_${name}_video`, videoFile)
    const poster = new Parse.File(`${courseId}_${name}_poster`, posterFile)
    return Promise.all([video.save(), poster.save()])
      .then(() => {
        const acl = new Parse.ACL()
        acl.setPublicReadAccess(true)
        acl.setWriteAccess(Parse.User.current().id, true)

        const lecture = new Lecture()
        lecture.setACL(acl)

        return lecture.save({
          courseId,
          name,
          description,
          video,
          poster
        }).then(lecture => lecture.toJSON())
      })
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
        const promises = []
        Object.entries(changes).forEach(([k, v]) => {
          if (k === 'videoFile' || k === 'posterFile') {
            const type = k.substr(0, k.length - 4)
            const file = new Parse.File(`${lecture.courseId}_${lecture.name}_${type}`, v)
            promises.push(file.save())
            lecture.set(type, file)
          }
          else {
            lecture.set(k, v)
          }
        })
        return Promise.all(promises)
          .then(() => lecture.save())
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

export default Lecture

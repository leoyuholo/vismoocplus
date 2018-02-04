import Parse from 'parse'
import { errorHandler } from '../../helpers'

class Lecture extends Parse.Object {
  constructor () {
    super('Lecture')
  }

  static create ({ courseId, name, description, videoUrl, posterUrl, captionUrl }) {
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
      captionUrl
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

export default Lecture

import Parse from 'parse'
import { errorHandler } from '../../helpers'

class UserSetting extends Parse.Object {
  constructor () {
    super('UserSetting')
  }

  static defaultSetting () {
    return {
      volume: 0.5,
      playbackRate: 1
    }
  }

  static create () {
    const userSetting = new UserSetting()
    userSetting.set('user', Parse.User.current())
    return userSetting.save(UserSetting.defaultSetting())
      .then(userSetting => userSetting.toJSON())
      .catch(errorHandler)
  }

  static get () {
    const query = new Parse.Query(UserSetting)
    query.equalTo('user', Parse.User.current())
    return query.find()
      .then(userSettings => userSettings.length === 0 ? UserSetting.create() : userSettings[0].toJSON())
      .catch(errorHandler)
  }

  static save (id, changes) {
    const query = new Parse.Query(UserSetting)
    return query.get(id)
      .then(userSetting => userSetting.save(changes))
      .then(userSetting => userSetting.toJSON())
      .catch(errorHandler)
  }
}

export default UserSetting

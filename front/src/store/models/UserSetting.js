import Parse from 'parse'
import { errorHandler } from '../../helpers'

class UserSetting extends Parse.Object {
  constructor () {
    super('UserSetting')
  }

  static get () {
    const user = Parse.User.current()
    if (user.get('userSetting')) {
      return user.get('userSetting')
        .fetch()
        .then(userSetting => userSetting.toJSON())
        .catch(errorHandler)
    }

    const userSetting = new UserSetting()
    userSetting.setACL(user)
    return userSetting.save()
      .then(userSetting => {
        user.set('userSetting', userSetting)
        return user.save()
          .then(() => userSetting.toJSON())
      })
      .catch(errorHandler)
  }

  static save (changes) {
    return Parse.User.current()
      .get('userSetting')
      .save(changes)
      .then(userSetting => userSetting.toJSON())
      .catch(errorHandler)
  }
}

export default UserSetting

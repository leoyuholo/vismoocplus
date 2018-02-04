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
        .catch(errorHandler)
    }

    const userSetting = new UserSetting()
    userSetting.setACL(user)
    return userSetting.save()
      .then(userSetting => {
        user.set('userSetting', userSetting)
        return user.save()
          .then(() => userSetting)
      })
      .catch(errorHandler)
  }
}

export default UserSetting

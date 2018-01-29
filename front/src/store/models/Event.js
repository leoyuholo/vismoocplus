import Parse from 'parse'
import { Platform } from 'quasar'

class Event extends Parse.Object {
  constructor () {
    super('Event')
  }

  static track (eventName, dimensions, { attachPlatformInfo = true }) {
    const event = new Event()
    event.set('eventName', eventName)
    event.set('eventTimestamp', Date.now())
    event.set('eventUser', Parse.User.current())
    if (attachPlatformInfo) {
      Object.entries(Platform.is).forEach(([k, v]) => {
        event.set('platform_' + k, v)
      })
      event.set('platform_touch', Platform.has.touch)
    }
    Object.entries(dimensions).forEach(([k, v]) => {
      event.set(k, v)
    })
    return event.save()
  }
}

export default Event

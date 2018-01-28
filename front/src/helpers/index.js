import { Alert } from 'quasar'

import 'quasar-extras/animate/bounceInRight.css'
import 'quasar-extras/animate/bounceOutRight.css'

function alert (type, msg) {
  return new Promise((resolve, reject) => {
    const alert = Alert.create({
      enter: 'bounceInRight',
      leave: 'bounceOutRight',
      color: type,
      html: msg,
      position: 'top-right',
      dismissible: true,
      actions: [
        {
          label: 'Dismiss',
          handler () {
            alert.dismiss()
            resolve()
          }
        }
      ]
    })

    setTimeout(() => {
      alert.dismiss()
      resolve()
    }, 2000)
  })
}

function errorHandler (error) {
  console.warn(error)
}

function isValidHKUSTEmail (email) {
  return (/@connect.ust.hk$/.test(email) || /@ust.hk$/.test(email) || /@cse.ust.hk$/.test(email))
}

function defaultEmailDomain (email) {
  if (email && email.indexOf('@') === -1) {
    return `${email}@connect.ust.hk`
  }
  else {
    return email
  }
}

export {
  alert,
  errorHandler,
  isValidHKUSTEmail,
  defaultEmailDomain
}

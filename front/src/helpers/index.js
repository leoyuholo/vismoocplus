
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

function delayPromise (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}

export {
  errorHandler,
  isValidHKUSTEmail,
  defaultEmailDomain,
  delayPromise
}


function errorHandler (error) {
  console.warn(error)
}

function isValidHKUSTEmail (email) {
  return /@connect.ust.hk$/.test(email) || /@ust.hk$/.test(email) || /@cse.ust.hk$/.test(email) || /@gmail.com$/.test(email) || /@outlook.com$/.test(email)
}

function defaultEmailDomain (email) {
  return email && email.indexOf('@') === -1 ? `${email}@connect.ust.hk` : email
}

function delayPromise (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function nextItem (items, item) {
  const index = items.indexOf(item)
  if (index === -1) {
    return item
  }
  return index === (items.length - 1) ? items[index] : items[index + 1]
}

function previousItem (items, item) {
  const index = items.indexOf(item)
  if (index === -1) {
    return item
  }
  return index === 0 ? items[index] : items[index - 1]
}

function compareDate (da, db) {
  return (new Date(da)).valueOf() - (new Date(db)).valueOf()
}

export {
  errorHandler,
  isValidHKUSTEmail,
  defaultEmailDomain,
  delayPromise,
  nextItem,
  previousItem,
  compareDate
}

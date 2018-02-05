
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

function nextItem (items, item) {
  const index = items.indexOf(item)
  if (index === -1) {
    return item
  }
  const newIndex = index + 1
  if (newIndex >= items.length) {
    return items[items.length - 1]
  }
  else {
    return items[newIndex]
  }
}

function previousItem (items, item) {
  const index = items.indexOf(item)
  if (index === -1) {
    return item
  }
  const newIndex = index - 1
  if (newIndex < 0) {
    return items[0]
  }
  else {
    return items[newIndex]
  }
}

function compareDate (da, db) {
  const dateA = new Date(da)
  const dateB = new Date(db)

  return dateA.valueOf() - dateB.valueOf()
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

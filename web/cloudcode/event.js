
const event = (Parse) => {
  Parse.Cloud.beforeSave('Event', (req, res) => {
    req.object.set('ip', req.ip)
    req.object.set('origin', req.headers.origin)
    req.object.set('referer', req.headers.referer)
    res.success()
  })
}

module.exports = event

const express = require('express')
const config = require('config')
const ParseServer = require('parse-server').ParseServer

const app = express()

const api = new ParseServer({
  databaseURI: config.get('databaseURI'),
  appId: config.get('appId'),
  masterKey: config.get('masterKey'),
  serverURL: config.get('serverURL'),
  publicServerURL: config.get('publicServerURL'),
  maxUploadSize: config.get('maxUploadSize'),
  appName: config.get('appName'),
  emailAdapter: config.get('emailAdapter'),
  verifyUserEmails: config.get('verifyUserEmails'),
  preventLoginWithUnverifiedEmail: config.get('preventLoginWithUnverifiedEmail')
})

app.use('/parse', api)

app.listen(config.get('port'), () => {
  console.log('server running on port', config.get('port'))
})

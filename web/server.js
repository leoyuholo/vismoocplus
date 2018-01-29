const express = require('express')
const config = require('config')
const parseServer = require('parse-server')
const ParseServer = parseServer.ParseServer

const cloudcode = require('./cloudcode')

const app = express()

const parse = new ParseServer({
  databaseURI: config.get('databaseURI'),
  appId: config.get('appId'),
  masterKey: config.get('masterKey'),
  serverURL: config.get('serverURL'),
  publicServerURL: config.get('publicServerURL'),
  maxUploadSize: config.get('maxUploadSize'),
  appName: config.get('appName'),
  emailAdapter: config.get('emailAdapter'),
  verifyUserEmails: config.get('verifyUserEmails'),
  preventLoginWithUnverifiedEmail: config.get('preventLoginWithUnverifiedEmail'),
  cloud: cloudcode
})

app.use('/parse', parse)

app.listen(config.get('port'), () => {
  console.log('server running on port', config.get('port'))
})

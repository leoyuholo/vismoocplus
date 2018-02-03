const express = require('express')
const config = require('config')
const ParseDashboard = require('parse-dashboard')
const parseServer = require('parse-server')
const ParseServer = parseServer.ParseServer

const app = express()

app.enable('trust proxy')

const parse = new ParseServer({
  databaseURI: config.get('parseServer.databaseURI'),
  appId: config.get('parseServer.appId'),
  masterKey: config.get('parseServer.masterKey'),
  serverURL: config.get('parseServer.serverURL'),
  publicServerURL: config.get('parseServer.publicServerURL'),
  appName: config.get('parseServer.appName'),
  emailAdapter: config.get('parseServer.emailAdapter'),
  verifyUserEmails: config.get('parseServer.verifyUserEmails'),
  preventLoginWithUnverifiedEmail: config.get('parseServer.preventLoginWithUnverifiedEmail'),
  allowClientClassCreation: config.get('parseServer.allowClientClassCreation')
})

const dashboard = new ParseDashboard({
  apps: [{
    appId: config.get('parseDashboard.appId'),
    masterKey: config.get('parseDashboard.masterKey'),
    serverURL: config.get('parseDashboard.serverURL'),
    appName: config.get('parseDashboard.appName')
  }],
  users: [{
    user: config.get('parseDashboard.user'),
    pass: config.get('parseDashboard.pass')
  }]
}, { allowInsecureHTTP: process.env.NODE_ENV === 'development' })

app.use('/api', parse)

app.use('/dashboard', dashboard)

app.listen(config.get('port'), () => {
  console.log('server running on port', config.get('port'))
})

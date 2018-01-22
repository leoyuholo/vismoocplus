const express = require('express')
const config = require('config')
const ParseDashboard = require('parse-dashboard')

const app = express()

const dashboard = new ParseDashboard({
  apps: [{
    appId: config.get('appId'),
    masterKey: config.get('masterKey'),
    serverURL: config.get('serverURL'),
    appName: config.get('appName')
  }],
  users: [{
    user: config.get('user'),
    pass: config.get('pass')
  }]
}, {allowInsecureHTTP: true})

app.use('/dashboard', dashboard)

app.listen(config.get('port'), () => {
  console.log('dashboard running on port', config.get('port'))
})

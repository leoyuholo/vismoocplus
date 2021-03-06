var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  verifyUserEmails: true,
  parseConfig: {
    appId: '"vismoocplus"',
    serverURL: '"http://localhost:1337/api"'
  },
  analytics: {
    id: '"UA-888888888-1"',
    debug: {
      enabled: false,
      trace: true,
      sendHitTask: false
    }
  }
})

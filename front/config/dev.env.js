var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  parseConfig: {
    appId: '"vismoocplus-web"',
    serverURL: '"http://localhost:1337/parse"'
  }
})

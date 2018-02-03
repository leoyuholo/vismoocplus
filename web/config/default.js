module.exports = {
  port: 1337,
  parseServer: {
    databaseURI: 'mongodb://mongo:27017/dev',
    appId: 'vismoocplus',
    masterKey: 'myMasterKey',
    serverURL: 'http://web:1337/api',
    publicServerURL: 'http://localhost:1337/api',
    appName: 'VisMOOC+',
    verifyUserEmails: true,
    preventLoginWithUnverifiedEmail: true,
    allowClientClassCreation: true,
    emailAdapter: {
      module: '@parse/simple-mailgun-adapter',
      options: {
        fromAddress: 'parse@example.com',
        domain: 'example.com',
        apiKey: 'key-mykey'
      }
    }
  },
  parseDashboard: {
    appId: 'vismoocplus',
    masterKey: 'myMasterKey',
    serverURL: 'http://web:1337/api',
    appName: 'VisMOOC+',
    user: 'user',
    pass: 'pass'
  }
}

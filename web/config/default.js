module.exports = {
  databaseURI: 'mongodb://mongo:27017/dev',
  appId: 'vismoocplus-web',
  masterKey: 'myMasterKey',
  serverURL: 'http://web:1337/parse',
  publicServerURL: 'http://localhost:1337/parse',
  port: 1337,
  maxUploadSize: '20gb',
  appName: 'VisMOOC+',
  verifyUserEmails: true,
  preventLoginWithUnverifiedEmail: true,
  emailAdapter: {
    module: '@parse/simple-mailgun-adapter',
    options: {
      fromAddress: 'parse@example.com',
      domain: 'example.com',
      apiKey: 'key-mykey'
    }
  }
}

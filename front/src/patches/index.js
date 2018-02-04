import Parse from 'parse'

function patchParse () {
  Parse.User.resendVerificationEmail = (email, options) => {
    const RESTController = Parse.CoreManager.getRESTController()
    return RESTController.request(
      'POST',
      `verificationEmailRequest`,
      { email },
      options
    )
  }
}

function patch () {
  return patchParse()
}

export default patch

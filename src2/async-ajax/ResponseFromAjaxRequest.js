const { AsyncObject } = require('./../cutie/exports')
const responseFromAjaxRequest = require('./custom-calls/responseFromAjaxRequest')

// Represented result is {statusCode, headers, body}
class ResponseFromAjaxRequest extends AsyncObject {
  constructor (options, requestBody) {
    super(options, requestBody || null)
  }

  asyncCall () {
    return responseFromAjaxRequest
  }
}

module.exports = ResponseFromAjaxRequest

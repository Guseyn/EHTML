'use strict'

const { AsyncObject } = require('./../cutie/exports')

class JSResponseByHTTPReponseComponents extends AsyncObject {
  constructor (body, headers, statusCode) {
    super(body, headers, statusCode)
  }

  syncCall () {
    return (body, headers, statusCode) => {
      return {
        body,
        headers,
        statusCode
      }
    }
  }
}

module.exports = JSResponseByHTTPReponseComponents

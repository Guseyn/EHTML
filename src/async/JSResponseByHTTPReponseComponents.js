'use strict'

const { AsyncObject } = require('@page-libs/cutie')

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

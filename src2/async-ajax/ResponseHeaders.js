'use strict'

const { AsyncObject } = require('./../cutie/exports')

class ResponseHeaders extends AsyncObject {
  constructor (response) {
    super(response)
  }

  syncCall () {
    return (response) => {
      return response.headers
    }
  }
}

module.exports = ResponseHeaders

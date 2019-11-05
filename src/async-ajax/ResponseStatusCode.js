'use strict'

const { AsyncObject } = require('./../cutie/exports')

class ResponseStatusCode extends AsyncObject {
  constructor (response) {
    super(response)
  }

  syncCall () {
    return (response) => {
      return response.statusCode
    }
  }
}

module.exports = ResponseStatusCode

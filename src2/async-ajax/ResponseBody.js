'use strict'

const { AsyncObject } = require('./../cutie/exports')

class ResponseBody extends AsyncObject {
  constructor (response) {
    super(response)
  }

  syncCall () {
    return (response) => {
      return response.body
    }
  }
}

module.exports = ResponseBody

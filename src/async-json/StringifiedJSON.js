'use strict'

const { AsyncObject } = require('./../cutie/exports')

// Represented result is string
class StringifiedJSON extends AsyncObject {
  constructor (json) {
    super(json)
  }

  syncCall () {
    return JSON.stringify
  }
}

module.exports = StringifiedJSON

'use strict'

const { AsyncObject } = require('./../cutie/exports')
const prettyHtml = require('json-pretty-html').default

// Represented result is hmtl
class HTMLFromJSON extends AsyncObject {
  constructor (json) {
    super(json)
  }

  syncCall () {
    return (json) => {
      return prettyHtml(json)
    }
  }
}

module.exports = HTMLFromJSON

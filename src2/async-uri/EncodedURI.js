'use strict'

const { AsyncObject } = require('./../cutie/exports')

class EncodedURI extends AsyncObject {
  constructor (url) {
    super(url)
  }

  syncCall () {
    return (url) => {
      return encodeURI(url)
    }
  }
}

module.exports = EncodedURI

'use strict'

const { AsyncObject } = require('@page-libs/cutie')

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

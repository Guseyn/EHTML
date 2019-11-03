'use strict'

const { AsyncObject } = require('./../cutie/exports')

class RedirectedLocation extends AsyncObject {
  constructor (url) {
    super(url)
  }

  syncCall () {
    return (url) => {
      window.location.href = url
    }
  }
}

module.exports = RedirectedLocation

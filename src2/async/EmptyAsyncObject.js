'use strict'

const { AsyncObject } = require('./../cutie/exports')

class EmptyAsyncObject extends AsyncObject {
  constructor () {
    super()
  }

  syncCall () {
    return () => {

    }
  }
}

module.exports = EmptyAsyncObject

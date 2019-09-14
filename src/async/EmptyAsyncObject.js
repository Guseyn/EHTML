'use strict'

const { AsyncObject } = require('@page-libs/cutie')

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

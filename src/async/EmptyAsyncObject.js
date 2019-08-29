'use strict'

const { AsyncObject } = require('@cuties/cutie')

class EmptyAsyncObject extends AsyncObject {
  constructor () {
    super()
  }

  syncCall () {
    return () => {}
  }
}

module.exports = EmptyAsyncObject

'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class EmptyAsyncObject extends AsyncObject {
  constructor (values) {
    super(values)
  }

  syncCall () {
    return (values) => {

    }
  }
}

module.exports = EmptyAsyncObject

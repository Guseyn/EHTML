'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class ValueFromSessionStorage extends AsyncObject {
  constructor (sessionStorage, key) {
    super(sessionStorage, key)
  }

  syncCall () {
    return (sessionStorage, key) => {
      return sessionStorage.getItem(key)
    }
  }
}

module.exports = ValueFromSessionStorage

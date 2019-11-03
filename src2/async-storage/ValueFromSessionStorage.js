'use strict'

const { AsyncObject } = require('./../cutie/exports')

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

'use strict'

const { AsyncObject } = require('./../cutie/exports')

class SessionStorageWithRemovedValue extends AsyncObject {
  constructor (sessionStorage, key) {
    super(sessionStorage, key)
  }

  syncCall () {
    return (sessionStorage, key) => {
      sessionStorage.removeItem(key)
      return sessionStorage
    }
  }
}

module.exports = SessionStorageWithRemovedValue

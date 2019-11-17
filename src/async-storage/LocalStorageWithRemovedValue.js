
'use strict'

const { AsyncObject } = require('./../cutie/exports')

class LocalStorageWithRemovedValue extends AsyncObject {
  constructor (localStorage, key) {
    super(localStorage, key)
  }

  syncCall () {
    return (localStorage, key) => {
      localStorage.removeItem(key)
      return localStorage
    }
  }
}

module.exports = LocalStorageWithRemovedValue

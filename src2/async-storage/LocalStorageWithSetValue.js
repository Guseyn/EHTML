
'use strict'

const { AsyncObject } = require('./../cutie/exports')

class LocalStorageWithSetValue extends AsyncObject {
  constructor (localStorage, key, value) {
    super(localStorage, key, value)
  }

  syncCall () {
    return (localStorage, key, value) => {
      localStorage.setItem(key, value)
      return localStorage
    }
  }
}

module.exports = LocalStorageWithSetValue

'use strict'

const { AsyncObject } = require('./../cutie/exports')

class ValueFromLocalStorage extends AsyncObject {
  constructor (localStorage, key) {
    super(localStorage, key)
  }

  syncCall () {
    return (localStorage, key) => {
      return localStorage.getItem(key)
    }
  }
}

module.exports = ValueFromLocalStorage

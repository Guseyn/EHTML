'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class ValueFromMemoryStorage extends AsyncObject {
  constructor (memoryStorage, key) {
    super(memoryStorage, key)
  }

  syncCall () {
    return (memoryStorage, key) => {
      return memoryStorage.getItem(key)
    }
  }
}

module.exports = ValueFromMemoryStorage

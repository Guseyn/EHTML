'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class MemoryStorageWithAddedItemToArray extends AsyncObject {
  constructor (memoryStorage, key, value) {
    super(memoryStorage, key, value)
  }

  syncCall () {
    return (memoryStorage, key, value) => {
      memoryStorage.addItemToArray(key, value)
      return memoryStorage
    }
  }
}

module.exports = MemoryStorageWithAddedItemToArray

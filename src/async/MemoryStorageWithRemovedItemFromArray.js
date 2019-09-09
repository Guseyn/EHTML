'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class MemoryStorageWithRemovedItemFromArray extends AsyncObject {
  constructor (memoryStorage, key, index) {
    super(memoryStorage, key, index)
  }

  syncCall () {
    return (memoryStorage, key, index) => {
      memoryStorage.removeItemFromArray(key, index)
      return memoryStorage
    }
  }
}

module.exports = MemoryStorageWithRemovedItemFromArray

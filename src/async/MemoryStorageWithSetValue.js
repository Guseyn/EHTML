'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class MemoryStorageWithSetValue extends AsyncObject {
  constructor (memoryStorage, key, value) {
    super(memoryStorage, key, value)
  }

  syncCall () {
    return (memoryStorage, key, value) => {
      memoryStorage.setItem(key, value)
      return memoryStorage
    }
  }
}

module.exports = MemoryStorageWithSetValue

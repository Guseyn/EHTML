'use strict'

class MemoryStorage {
  constructor () {
    this.items = []
  }

  getItem (key) {
    return this.items[key]
  }

  setItem (key, value) {
    this.items[key] = value
  }
}

window.memoryStorage = new MemoryStorage()

module.exports = MemoryStorage

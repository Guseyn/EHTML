'use strict'

class MemoryStorage {
  constructor () {
    this.items = {}
  }

  getItem (keyPath) {
    const keyParts = keyPath.split('.')
    const key = keyParts[0]
    const pathOfValue = keyParts.splice(1).join('.')
    if (pathOfValue.length === 0) {
      return this.items[key] || null
    }
    // eslint-disable-next-line no-eval
    return eval(`this.items['${key}'].${pathOfValue}`) || null
  }

  setItem (keyPath, value) {
    const keyParts = keyPath.split('.')
    const key = keyParts[0]
    const pathOfValue = keyParts.splice(1).join('.')
    if (pathOfValue.length === 0) {
      this.items[key] = value
    } else {
      // eslint-disable-next-line no-eval
      eval(`this.items['${key}'].${pathOfValue} = value`)
    }
  }
}

module.exports = MemoryStorage

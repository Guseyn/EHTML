'use strict'

const E = require('./../E')

class EMemoryStorageValue extends E {
  constructor () {
    super()
  }

  static get observedAttributes () {
    return [
      'name',
      'data-key'
    ]
  }

  supportedActions () {
    return [ ]
  }

  onRender () {
    this.name = this.getAttribute('name')
  }

  value () {
    // eslint-disable-next-line no-undef
    return memoryStorage.getItem(
      this.getAttribute('data-key')
    )
  }
}

window.customElements.define('e-memory-storage-value', EMemoryStorageValue)

module.exports = EMemoryStorageValue

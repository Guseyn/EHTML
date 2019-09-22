'use strict'

const E = require('./../E')

class ELocalStorageValue extends E {
  constructor () {
    super()
  }

  onRender () {
    this.name = this.getAttribute('name')
  }

  value () {
    return localStorage.getItem(
      this.getAttribute('data-key')
    )
  }
}

window.customElements.define('e-local-storage-value', ELocalStorageValue)

module.exports = ELocalStorageValue

'use strict'

const E = require('./../E')

class ELocalStorageValue extends E {
  constructor () {
    super()
  }

  static get observedAttributes () {
    return [
      'name',
      'data-key'
    ]
  }

  onRender () {
    this.name = this.attr('name')
  }

  value () {
    return localStorage.getItem(
      this.attr('data-key')
    )
  }
}

window.customElements.define('e-local-storage-value', ELocalStorageValue)

module.exports = ELocalStorageValue

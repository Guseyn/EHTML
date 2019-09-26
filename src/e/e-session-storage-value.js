'use strict'

const E = require('./../E')

class ESessionStorageValue extends E {
  constructor () {
    super()
  }

  supportedActions () {
    return [ ]
  }

  onRender () {
    this.name = this.getAttribute('name')
  }

  value () {
    return sessionStorage.getItem(
      this.getAttribute('data-key')
    )
  }
}

window.customElements.define('e-session-storage-value', ESessionStorageValue)

module.exports = ESessionStorageValue

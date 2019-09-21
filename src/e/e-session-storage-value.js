'use strict'

const E = require('./../E')

class ESessionStorageValue extends E {
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
    return sessionStorageWrapper.getItem(
      this.getAttribute('data-key')
    )
  }
}

window.customElements.define('e-session-storage-value', ESessionStorageValue)

module.exports = ESessionStorageValue

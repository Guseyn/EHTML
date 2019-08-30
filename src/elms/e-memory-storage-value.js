'use strict'

const HTMLTunedElement = require('./../global-objects/HTMLTunedElement')

class EMemoryStorageValue extends HTMLTunedElement {
  constructor () {
    super()
  }

  static get observedAttributes () {
    return ['name', 'data-key']
  }

  render () {
    this.name = this.getAttribute('name')
  }

  value () {
    // eslint-disable-next-line no-undef
    return memoryStorage.getItem(this.getAttribute('data-key'))
  }
}

module.exports = EMemoryStorageValue

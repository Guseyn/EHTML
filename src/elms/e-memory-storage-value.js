'use strict'

const HTMLTunedElement = require('./../objects/HTMLTunedElement')

class EMemoryStorageValue extends HTMLTunedElement {
  constructor () {
    super()
  }

  static get observedAttributes () {
    return ['data-key']
  }

  render () {

  }

  value () {
    return localStorage.getItem(this.getAttribute('data-key'))
  }
}

module.exports = EMemoryStorageValue

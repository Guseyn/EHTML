'use strict'

const HTMLTunedElement = require('./../global-objects/HTMLTunedElement')

class ELocalStorageValue extends HTMLTunedElement {
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

  render () {
    this.name = this.getAttribute('name')
    this.appliedActions().call()
  }

  value () {
    return localStorage.getItem(this.getAttribute('data-key'))
  }
}

module.exports = ELocalStorageValue

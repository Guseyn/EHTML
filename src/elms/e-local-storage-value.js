'use strict'

const HTMLTunedElement = require('./../objects/HTMLTunedElement')

class ELocalStorageValue extends HTMLTunedElement {
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
    return localStorage.getItem(this.getAttribute('data-key'))
  }
}

module.exports = ELocalStorageValue

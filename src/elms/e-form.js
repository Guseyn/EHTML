'use strict'

const HTMLTunedElement = require('./../objects/HTMLTunedElement')

class EForm extends HTMLTunedElement {
  constructor () {
    super()
  }

  static get observedAttributes () {
    return ['data-request-url', 'data-request-button']
  }

  render () {

  }
}

module.exports = EForm

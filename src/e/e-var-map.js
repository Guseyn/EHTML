'use strict'

const ElementWithMappedObject = require('./../async/ElementWithMappedObject')
const E = require('./../E')

E(
  'e-var-map',
  class extends HTMLElement {
    constructor () {
      super()
    }

    onRender () {
      new ElementWithMappedObject(
        this
      ).call()
    }
  }
)

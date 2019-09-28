'use strict'

const ElementWithMappedVars = require('./../async/ElementWithMappedVars')
const E = require('./../E')

E(
  'e-var-map',
  class extends HTMLElement {
    constructor () {
      super()
    }

    onRender () {
      new ElementWithMappedVars(
        this
      ).call()
    }
  }
)

'use strict'

const ElementWithMappedVars = require('./../async/ElementWithMappedVars')
const E = require('./../E')

class EVarMap extends E {
  constructor () {
    super()
  }

  onRender () {
    new ElementWithMappedVars(
      this
    ).call()
  }
}

window.customElements.define('e-var-map', EVarMap)

module.exports = EVarMap

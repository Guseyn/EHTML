'use strict'

const E = require('./E')
const { ElementWithMappedObject } = require('./../async-dom/exports')

class EVAR_MAP extends E {
  constructor (node) {
    super(node)
  }

  activate () {
    new ElementWithMappedObject(
      this.node
    ).call()
  }
}

module.exports = EVAR_MAP

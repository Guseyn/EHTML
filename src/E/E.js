'use strict'

const { StringWithMappedObjectAndAppliedVariables } = require('./../string/exports')

class E {
  constructor (node) {
    this.node = node
  }

  applyVariablesToAttributes () {
    for (let i = 0; i < this.node.attributes.length; i++) {
      this.node.setAttribute(
        this.node.attributes[i].name,
        new StringWithMappedObjectAndAppliedVariables(
          this.node.attributes[i].value
        ).value()
      )
    }
    return this
  }

  activate () {
    throw new Error('activate function must be defined')
  }
}

module.exports = E

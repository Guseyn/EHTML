'use strict'

const { AsyncObject } = require('./../cutie/exports')

class ActivatedTemplate extends AsyncObject {
  constructor (node) {
    super(node)
  }

  syncCall () {
    return (node) => {
      const contentNode = document.importNode(node.content, true)
      node.parentNode.insertBefore(contentNode, node)
      node.parentNode.removeChild(node)
      return node
    }
  }
}

module.exports = ActivatedTemplate
